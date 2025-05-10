import { useEffect, useRef, useState, useCallback } from 'react';

export function useWebSocket(roomId, onMessage) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId || roomId === 'local') return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (onMessage) onMessage(message);
    };

    ws.onclose = (e) => {
      setConnected(false);
      console.warn('closed', e.code);
      // 자동 재연결 로직 (선택)
      // setTimeout(() => connect(), 1000);
    };

    ws.onerror = (err) => {
      console.error('error', err);
    };

    return () => {
      ws.close();
    }
    // eslint-disable-next-line
  }, [roomId]);

  const sendMessage = useCallback((data) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected.');
    }
  }, []);

  return { sendMessage, connected };
}
