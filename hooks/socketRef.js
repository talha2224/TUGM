import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import config from '../config'; // your base socket url

export default function useLiveStreamSocket(streamId, onNewMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!streamId) return;

    // ✅ connect with auto-reconnect options
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      forceNew: true,
    });

    // ✅ join room
    socketRef.current.emit('join', { streamId });

    // ✅ listen for messages
    socketRef.current.on('newMessage', (msg) => {
      onNewMessage && onNewMessage(msg);
    });

    // ✅ handle reconnection
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current.emit('join', { streamId });
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    // ✅ cleanup
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
