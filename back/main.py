from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ban_storage import load_ban_list, save_ban_list
from collections import defaultdict, deque
import json
import time
import logging

ALLOWED_TYPES = {
    "node_move",
    "node_update",
    "node_add",
    "node_delete",
    "edge_delete",
    "elk_layout"
}

MAX_CONNECTIONS_PER_IP = 100 # 기존 3 / 테스트용 100
MAX_MESSAGE_SIZE = 10_000  # 10KB
MAX_MESSAGES_PER_SECOND = 8
WINDOW_SECONDS = 1
BAN_THRESHOLD = 5  # 제한 위반 횟수 초과 시 ban

ip_connection_counts = defaultdict(int)
message_timestamps = defaultdict(lambda: deque())
ip_violations = defaultdict(int)  # IP별 위반 횟수
banned_ips = load_ban_list()
connection_logs = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처에서의 요청을 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

logging.basicConfig(
    filename="websocket_server.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

ADMIN_TOKEN = "secret_admin_token"

class ConnectionManager:
    def __init__(self):
        self.active_rooms: dict[str, list[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        ip = websocket.client.host

        if ip in banned_ips:
            logging.warning(f"[BANNED] Connection attempt from banned IP: {ip}")
            await websocket.close(code=4000)
            return False
        
        if ip_connection_counts[ip] >= MAX_CONNECTIONS_PER_IP:
            logging.warning(f"[LIMIT] Too many connections from IP: {ip}")
            await websocket.close(code=4000)
            return False
        
        await websocket.accept()
        ip_connection_counts[ip] += 1
        self.active_rooms.setdefault(room_id, []).append(websocket)
        logging.info(f"[CONNECT] IP {ip} joined room {room_id}")
        return True

    def disconnect(self, room_id: str, websocket: WebSocket):
        ip = websocket.client.host
        ip_connection_counts[ip] -= 1
        if ip_connection_counts[ip] <= 0:
            del ip_connection_counts[ip]
        if room_id in self.active_rooms and websocket in self.active_rooms[room_id]:
            self.active_rooms[room_id].remove(websocket)
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]
        if websocket in message_timestamps:
            del message_timestamps[websocket]

        logging.info(f"[DISCONNECT] IP {ip} left room {room_id}")

    async def broadcast(self, room_id: str, message: str):
        for connection in self.active_rooms.get(room_id, []):
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    ip = websocket.client.host
    print(f"[CONNECT TRY] {ip} to room {room_id}")
    
    connected = await manager.connect(room_id, websocket)
    if not connected:
        print(f"[MANAGER REJECTED] {ip} connection to room {room_id}")
        return
    
    print(f"[CONNECTION OPEN] {ip} joined room {room_id}")

    try:
        while True:
            data = await websocket.receive_text()
            print(f"[RECEIVED] {data}")

            if len(data) > MAX_MESSAGE_SIZE:
                logging.warning(f"[SIZE] Message too large from {ip}")
                await websocket.close(code=4001)
                break

            now = time.time()
            timestamps = message_timestamps[websocket]
            timestamps.append(now)

            while timestamps and now - timestamps[0] > WINDOW_SECONDS:
                timestamps.popleft()

            if len(timestamps) > MAX_MESSAGES_PER_SECOND:
                logging.warning(f"[RATE LIMIT] {ip} exceeded message rate")
                ip_violations[ip] += 1
                if ip_violations[ip] >= BAN_THRESHOLD:
                    banned_ips.add(ip)
                    logging.error(f"[BAN] IP {ip} has been banned")
                await websocket.close(code=4002)
                break

            try:
                msg = json.loads(data)
                if not isinstance(msg, dict):
                    raise ValueError
                if "type" not in msg or msg["type"] not in ALLOWED_TYPES:
                    raise ValueError("Invalid type")
                if "payload" not in msg and msg["type"] != "elk_layout":
                    raise ValueError("Missing payload")
            except Exception:
                logging.warning(f"[INVALID] Malformed message from {ip}")
                await websocket.close(code=4003)
                break

            await manager.broadcast(room_id, data)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)


def is_admin(token: str):
    return token == ADMIN_TOKEN

@app.get("/admin/ban-list")
def get_ban_list(token: str):
    if not is_admin(token):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return {"banned_ips": list(banned_ips)}

@app.get("/admin/logs")
def get_logs(token: str):
    if not is_admin(token):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return {"logs": connection_logs[-100:]}  # 마지막 100개 로그 반환

@app.get("/debug/connections")
def debug_connections():
    return dict(ip_connection_counts)