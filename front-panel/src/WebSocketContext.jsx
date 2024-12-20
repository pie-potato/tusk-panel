import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children, url }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url);

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
  }, [url]);

  // Возвращаем только сокет и статус соединения
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);