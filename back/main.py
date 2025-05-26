from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ban_storage import load_ban_list, save_ban_list
from collections import defaultdict, deque
from dotenv import load_dotenv
import json
import time
import logging
import asyncio
import os

load_dotenv()

MAX_CONNECTIONS_PER_IP = os.environ.get('MAX_CONNECTIONS_PER_IP')
ROOT_PATH = os.environ.get('ROOT_PATH')
ALLOW_ORIGIN = os.environ.get('ALLOW_ORIGIN')

ALLOWED_TYPES = {
    "node_move",
    "node_update",
    "node_add",
    "node_delete",
    "edge_delete",
    "elk_layout",
    "edge_add",
    "flow_clear",
    "batch_update_host",
}

MAX_MESSAGE_SIZE = 10_000  # 10KB
MAX_MESSAGES_PER_SECOND = 8
WINDOW_SECONDS = 1
BAN_THRESHOLD = 5  # 제한 위반 횟수 초과 시 ban

ip_connection_counts = defaultdict(int)
message_timestamps = defaultdict(lambda: deque())
ip_violations = defaultdict(int)  # IP별 위반 횟수
banned_ips = load_ban_list()
connection_logs = []
room_logs = defaultdict(list)

logging.basicConfig(
    filename="websocket_server.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

class ConnectionManager:
    def __init__(self):
        self.active_rooms: dict[str, list[WebSocket]] = {}
        self.hosts: dict[str, WebSocket] = {}
        self.room_data: dict[str, str] = {}
        self.room_locks: dict[str, asyncio.Lock] = {}
        self._lock = asyncio.Lock()
        self.lock_for_locks = asyncio.Lock()

    async def get_room_lock(self, room_id: str) -> asyncio.Lock:
        async with self.lock_for_locks:
            if room_id not in self.room_locks:
                self.room_locks[room_id] = asyncio.Lock()
            return self.room_locks[room_id]
        
    async def connect(self, room_id: str, websocket: WebSocket) -> tuple[bool, bool]:
        ip = websocket.client.host

        if ip in banned_ips:
            logging.warning(f"BAN) Con banned {ip}")
            await websocket.close(code=4000)
            return False, False
        
        if ip_connection_counts[ip] >= MAX_CONNECTIONS_PER_IP:
            logging.warning(f"LIM) many con from {ip}")
            await websocket.close(code=4000)
            return False, False
        
        await websocket.accept()
        ip_connection_counts[ip] += 1

        is_host = False
        async with self._lock:
            lock = await self.get_room_lock(room_id)
            async with lock:
                if room_id not in self.active_rooms:
                    self.active_rooms[room_id] = []

                if room_id not in self.hosts:
                    self.hosts[room_id] = websocket
                    is_host = True
                    logging.info(f"HOST ASSIG) {ip} of room {room_id}")

                self.active_rooms.setdefault(room_id, []).append(websocket)
                logging.info(f"CON) IP {ip} joined {room_id}")
                
                if room_id in self.room_data and not is_host:
                    await websocket.send_text(self.room_data[room_id])
        return True, is_host

    def disconnect(self, room_id: str, websocket: WebSocket):
        ip = websocket.client.host
        ip_connection_counts[ip] -= 1

        if ip_connection_counts[ip] <= 0:
            del ip_connection_counts[ip]

        is_host = self.hosts.get(room_id) is websocket

        if room_id in self.active_rooms and websocket in self.active_rooms[room_id]:
            self.active_rooms[room_id].remove(websocket)

            if is_host:
                for ws in list(self.active_rooms[room_id]):
                    try:
                        asyncio.create_task(ws.close(code=4004))  # 비동기 종료
                    except:
                        pass
                logging.info(f"CLOSE) Host left {room_id}")
            
            if is_host or not self.active_rooms[room_id]:
                self.active_rooms.pop(room_id, None)
                self.hosts.pop(room_id, None)
                self.room_data.pop(room_id, None)
                room_logs.pop(room_id, None)
        if websocket in message_timestamps:
            del message_timestamps[websocket]

        logging.info(f"DISCON) {ip} left {room_id}")

    async def broadcast(self, room_id: str, message: str, sender: WebSocket = None):
        for connection in self.active_rooms.get(room_id, []):
            if connection is sender:
                continue
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

app = FastAPI(root_path=ROOT_PATH if ROOT_PATH else None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOW_ORIGIN],  # 모든 출처에서의 요청을 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    
    connected, is_host = await manager.connect(room_id, websocket)
    if not connected:
        logging.warning(f"LOST) connection lost from {ip}")
        return
    
    ip = websocket.client.host

    if is_host:
        await websocket.send_text(json.dumps({'type': 'you_are_host', 'roomId': room_id}))

    if not is_host and room_logs[room_id]:
        try:
            payload = [json.loads(msg) if isinstance(msg, str) else msg for msg in room_logs[room_id]]
            batch_message = {
                "type": "batch_update",
                "payload": payload,
            }
            await websocket.send_text(json.dumps(batch_message))
        except:
            pass
    
    try:
        while True:
            data = await websocket.receive_text()

            if len(data) > MAX_MESSAGE_SIZE:
                logging.warning(f"SIZE) too large from {ip}")
                await websocket.close(code=4001)
                break

            now = time.time()
            timestamps = message_timestamps[websocket]
            timestamps.append(now)

            while timestamps and now - timestamps[0] > WINDOW_SECONDS:
                timestamps.popleft()

            if len(timestamps) > MAX_MESSAGES_PER_SECOND:
                logging.warning(f"LIM) {ip} exceeded message rate")
                ip_violations[ip] += 1
                if ip_violations[ip] >= BAN_THRESHOLD:
                    banned_ips.add(ip)
                    logging.error(f"BAN) {ip} banned")
                await websocket.close(code=4002)
                break

            try:
                msg = json.loads(data)
                if not isinstance(msg, dict):
                    raise ValueError
                if "type" not in msg or msg["type"] not in ALLOWED_TYPES:
                    raise ValueError("Invalid type")
                if "payload" not in msg:
                    raise ValueError("Missing payload")
            except Exception:
                logging.warning(f"INV) Malformed msg from {ip}")
                await websocket.close(code=4003)
                manager.disconnect(room_id, websocket) # close만 하고 나가는바람에 host가 좀비가 되어서 추가함
                break
            
            tempData = json.loads(data)
            appendFlag = not log_optimizer(tempData, room_id)
            if appendFlag:
                room_logs[room_id].append(data)

            await manager.broadcast(room_id, data, sender=websocket)

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(room_id, websocket)

def log_optimizer(tempData: dict, room_id: str) -> bool:
    
    data_type = tempData["type"]
    delete_flag = False

    if data_type == "node_delete":
        payload_id = tempData["payload"]["id"]
        delete_target = {"node_add", "node_update", "node_move"}
        basket = [
            idx for idx, log in enumerate(room_logs[room_id])
            if (x := json.loads(log))["type"] in delete_target and x["payload"]["id"] == payload_id
        ]
        if basket:
            for idx in reversed(basket):
                del room_logs[room_id][idx]
            delete_flag = True

    elif data_type == "edge_delete":
        payload_id = tempData["payload"]["id"]
        for idx, log in enumerate(room_logs[room_id]):
            x = json.loads(log)
            if x["type"] == "edge_add" and x["payload"]["id"] == payload_id:
                del room_logs[room_id][idx]
                delete_flag = True
                break

    elif data_type == "node_move":
        payload_id = tempData["payload"]["id"]
        for idx, log in enumerate(room_logs[room_id]):
            x = json.loads(log)
            if x["type"] == "node_move" and x["payload"]["id"] == payload_id:
                del room_logs[room_id][idx]
                break
    
    elif data_type == "flow_clear":
        room_logs[room_id] = []
        delete_flag = True

    elif data_type == "batch_update_host":
        if not len(room_logs[room_id]):
            room_logs[room_id].extend(tempData["payload"]["nodes"])
            room_logs[room_id].extend(tempData["payload"]["edges"])
        delete_flag = True
    return delete_flag

# @app.get("/admin/ban-list")
# def get_ban_list(token: str):
#     return {"banned_ips": list(banned_ips)}

# @app.get("/admin/logs")
# def get_logs(token: str):
#     return {"logs": connection_logs[-100:]}

# @app.get("/debug/connections")
# def debug_connections():
#     return dict(ip_connection_counts)