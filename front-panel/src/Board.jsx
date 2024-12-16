import React, { useState, useEffect } from 'react';
import Column from './Column';
import { getColumnByIdBoard, addColumn } from './api/response';
import { io } from "socket.io-client";

export default function Board({ boardId }) {
    const [columns, setColumns] = useState([]);
    const [task, setTask] = useState([])
    const [newColumnName, setNewColumnName] = useState('');
    console.log(columns);

    const responseColumnById = async (boardId) => {
        const response = await getColumnByIdBoard(boardId)
        setColumns(response.data)
    }

    useEffect(() => {
        if (!boardId) return;
        responseColumnById(boardId)
        console.log(columns);

        const socket = io(`http://${window.location.hostname}:5000`); // Подключаемся к Socket.IO серверу
        socket.on('connect', () => { // После установки соединения
            console.log('Соединение с сервером установлено');
            socket.emit('joinBoard', boardId); // Присоединяемся к комнате доски, используя boardId
        });
        socket.on('addColumn', (newColumn) => { //  Добавление колонки
            setColumns(prevColumns => [...prevColumns, newColumn])
        });
        socket.on('updateColumn', (updatedColumn) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === updatedColumn._id) {
                    return { ...e, title: updatedColumn.title }
                }
                return e
            }))
        });
        socket.on('deleteColumn', (deletedColumnId) => {
            setColumns(prevColumns => prevColumns.filter(column => column._id !== deletedColumnId));
        });
        socket.on('addTask', (newTask) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === newTask.columnId) {
                    return { ...e, tasks: [...e.tasks, newTask] }
                }
                return e
            }))
        });
        socket.on('deleteTask', (deletedtask) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === deletedtask._id) {
                    return { ...e, tasks: e.tasks.filter(e => e._id !== deletedtask.tasks[0]) }
                }
                return e
            }))
        });
        return () => {
            socket.disconnect();
        };

    }, [boardId]);



    return (
        <div style={{ overflowX: 'scroll' }}>
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