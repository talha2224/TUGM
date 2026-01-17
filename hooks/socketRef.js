import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import config from '../config';
export default function useLiveStreamSocket(streamId, onNewMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!streamId) return;

    // Connect to socket
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      forceNew: true,
    });

    // Join room
    socketRef.current.emit('join', { streamId });

    socketRef.current.on('newMessage', (msg) => {
      if (onNewMessage) {
        onNewMessage((prev) => {
          const updated = [msg, ...prev];
          if (updated.length > 5) {
            return updated.slice(0, 5);
          }
          return updated;
        });
      }
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current.emit('join', { streamId });
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [streamId]);

  return socketRef;
}
