import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);


  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        setIsConnected(false);
        setCurrentRoom(null);
    });
      
    newSocket.on('reconnect', () => {
          if (currentRoom) {
              joinRoom(currentRoom);
          }
      });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

    const joinRoom = useCallback((room) => {
      if (socket && socket.connected) {
          socket.emit("joinRoom", room);
          setCurrentRoom(room);
      }
    }, [socket]);


    const leaveRoom = useCallback((room) => {
        if (socket && socket.connected) {
            socket.emit("leaveRoom", room);
            setCurrentRoom(null);
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