import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isOpen: false,
    projectId: null,
    chatId: null
  });

  const openChat = (projectId, chatId) => {
    setChatState({
      isOpen: true,
      projectId,
      chatId
    });
  };

  const closeChat = () => {
    setChatState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ChatContext.Provider value={{ chatState, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};