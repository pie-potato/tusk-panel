import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Chat.module.css';
import { useChat } from '../contexts/ChatContext';
import { useSocket } from '../contexts/WebSocketContext'
// import axios from 'axios';
import axios from '../configs/axiosConfig';
import Button from '../UI/Button/Button';
import { deleteChat } from '../api/response/chatresponse';
import { sendMessage } from '../api/response/messageResponse';
import { createPortal } from 'react-dom';

const Chat = () => {
    // Получаем состояние чата
    const { chatState, closeChat } = useChat();
    const { isOpen, projectId, chatId } = chatState;

    // Получаем сокет
    const { socket, isConnected, joinRoom, leaveRoom } = useSocket();

    // Локальное состояние для сообщений
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [errorState, setErrorState] = useState()
    const messagesEndRef = useRef(null);

    // Подключение к комнате чата
    useEffect(() => {
        if (!isOpen || !chatId || !socket) return;

        joinRoom(chatId);

        // Обработчики событий сокета
        const sendMessage = (message) => {
            console.log(message);

            setMessages(prev => [...prev, message]);
        };

        const messageDelete = (messageId) => {
            setMessages(prev => prev.filter(msg => msg._id !== messageId));
        };

        socket.on('sendMessage', sendMessage);
        socket.on('deleteMessage', messageDelete);
        socket.on('deleteChat', closeChat)

        // Загрузка истории сообщений
        const loadMessages = async () => {
            try {
                const response = await axios.get(`/api/message/${chatId}`);
                setMessages(response.data);
            } catch (error) {
                setErrorState(error.status)
                console.error('Failed to load messages:', error)
            }
        };

        loadMessages();

        return () => {
            leaveRoom(chatId);
            socket.off('sendMessage', sendMessage);
            socket.off('messageDeleted', messageDelete);
        };
    }, [isOpen, chatId, socket, joinRoom, leaveRoom]);

    // Автоскролл
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Отправка сообщения
    const createMessage = async () => {
        if (!newMessage.trim() || !socket || !chatId) return;
        await sendMessage(chatId, newMessage)
        // await axios.post(`/api/message/${chatId}`, { content: newMessage })
        setNewMessage('');
    };

    // Удаление сообщения
    const handleDeleteMessage = (messageId) => {
        if (!socket) return;
        socket.emit('deleteMessage', { messageId });
    };

    return createPortal(
        <div className={`${styles.chatPanel} ${isOpen ? styles.open : ''}`}>
            <div className={styles.chatHeader}>
                <h3>Чат задачи</h3>
                <Button onClick={() => deleteChat(projectId, chatId)}>Удалить чат</Button>
                <Button className={styles.closeBtn} onClick={closeChat}>×</Button>
            </div>

            <div className={styles.messagesContainer}>
                {
                    errorState === 403
                        ?
                        <div className={styles.acces_denied}>Нет доступа к этому чату</div>
                        :
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className={`${styles.message} ${message.sender.username === JSON.parse(localStorage.getItem('user')).username ? styles.sent : styles.received}`}
                            >
                                {
                                    message.sender.username !== JSON.parse(localStorage.getItem('user')).username
                                    &&
                                    <div className={styles.messageSender}>
                                        {message.sender.firstname} {message.sender.secondname}
                                    </div>
                                }
                                <div className={styles.messageContent}>{message.content}</div>
                                <div className={styles.messageMeta}>
                                    <span className={styles.messageTime}>
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                    {message.sender.username === JSON.parse(localStorage.getItem('user')).username && (
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteMessage(message._id)}
                                        >
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.messageInput}>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    disabled={!isConnected}
                />
                <Button
                    onClick={createMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className={styles.sendButton}
                >
                    {isConnected ? 'Отправить' : 'Соединение...'}
                </Button>
            </div>
        </div>,
        document.body
    );
};

export default Chat;