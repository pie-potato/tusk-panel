import React, { useState, useEffect } from 'react';
import Column from './Column';
import { getColumnByIdBoard, addColumn } from './api/response';
import { io } from "socket.io-client";

export default function Board({ boardId }) {
    const [columns, setColumns] = useState([]);
    const [task, setTask] = useState([])
    const [newColumnName, setNewColumnName] = useState('');

    useEffect(() => {   
        if (!boardId) return;
        getColumnByIdBoard(setColumns, boardId)
        console.log("asdasd");
        console.log(columns);

        const socket = io('http://localhost:5000'); // Подключаемся к Socket.IO серверу
        socket.on('connect', () => { // После установки соединения
            console.log('Соединение с сервером установлено');
            socket.emit('joinBoard', boardId); // Присоединяемся к комнате доски, используя boardId
        });
        // Обработчики событий Socket.IO для этой доски
        socket.on('updateTask', (updatedTask) => {
            // ... (логика обновления задачи)
        });
        socket.on('addColumn', (newColumn) => { //  Добавление колонки
            setColumns(prevColumns => [...prevColumns, newColumn])
        });
        socket.on('columnDeleted', (deletedColumnId) => {
            setColumns(prevColumns => prevColumns.filter(column => column._id !== deletedColumnId));
        });
        // Отключаемся от Socket.IO при размонтировании компонента
        return () => {
            socket.disconnect();
        };

    }, [boardId]);



    return (
        <div >
            <div className="board_columns">
                {columns.map((column) => (
                    <Column key={column._id} column={column} />
                ))}
                <div>
                    <div>
                        <input
                            type="text"
                            className='add_column'
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="Добавить колонку..."
                            onKeyDown={event => { if (event.key === "Enter") addColumn(newColumnName, setNewColumnName, boardId, localStorage.getItem('user')) }}
                        />
                        <button className='add_task' onClick={() => addColumn(newColumnName, setNewColumnName, boardId, localStorage.getItem('user'))}>Добавить колонку</button>
                    </div>
                </div>
            </div>
        </div>
    );
}