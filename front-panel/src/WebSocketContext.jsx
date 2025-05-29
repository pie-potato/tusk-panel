import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(`${process.env.PUBLIC_BACKEND_URL}`, { path: '/socket.io' });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((room) => {
    if (socket && socket.connected) {
      socket.emit("joinRoom", room);
    }
  }, [socket]);

  const leaveRoom = useCallback((room) => {
    if (socket && socket.connected) {
      socket.emit("leaveRoom", room);
    }
  }, [socket]);

  // Возвращаем только сокет и статус соединения
  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);