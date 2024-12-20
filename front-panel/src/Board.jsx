import React, { useState, useEffect } from 'react';
import Column from './Column';
import { getColumnByIdBoard, addColumn } from './api/response';
import { io } from "socket.io-client";

export default function Board({ boardId }) {
    const [newColumnName, setNewColumnName] = useState('');
    const [columns, setColumns] = useState([]);
    console.log(columns);

    const responseColumnById = async (boardId) => {
        const response = await getColumnByIdBoard(boardId)
        setColumns(response.data)
    }
    useEffect(() => {
        if (!boardId) return;
        responseColumnById(boardId)

        const socket = io(`ws://${window.location.hostname}:5000`); // Подключаемся к Socket.IO серверу
        socket.on('connect', () => { // После установки соединения
            console.log('Соединение с сервером установлено');
            socket.emit('joinBoard', boardId); // Присоединяемся к комнате доски, используя activeBoard
        });
        socket.on('addColumn', (newColumn) => { //  Добавление колонки
            setColumns(prevColumns => [...prevColumns, newColumn])
        });
        socket.on('updateColumn', (updatedColumn) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === updatedColumn._id) {
                    return updatedColumn
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
        socket.on('updateTask', (updatedTask) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === updatedTask.columnId) {
                    return {
                        ...e, tasks: e.tasks.map(e => {
                            if (e._id === updatedTask._id) {
                                return updatedTask
                            }
                            return e
                        })
                    }
                }
                return e
            }))
        });
        socket.on('deleteTask', (deletedtask) => { //  Добавление колонки
            console.log(deletedtask);

            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === deletedtask.columnId) {
                    return { ...e, tasks: e.tasks.filter(e => e._id !== deletedtask._id) }
                }
                return e
            }))
        });
        socket.on('addTaskAssing', (updatedTask) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === updatedTask.columnId) {
                    return {
                        ...e, tasks: e.tasks.map(e => {
                            if (e._id === updatedTask.taskId) {
                                if (e.assignedTo.length) {
                                    return { ...e, assignedTo: [...e.assignedTo, updatedTask.assignedTo] }
                                }
                                return { ...e, assignedTo: [updatedTask.assignedTo] }
                            }
                            return e
                        })
                    }
                }
                return e
            }))
        });
        socket.on('deleteTaskAssing', (updatedTask) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === updatedTask.columnId) {
                    return {
                        ...e, tasks: e.tasks.map(e => {
                            if (e._id === updatedTask.taskId) {
                                return {...e, assignedTo: e.assignedTo.filter(e => e._id !== updatedTask.assignedTo._id)}
                            }
                            return e
                        })
                    }
                }
                return e
            }))
        });
        socket.on('addAttachmentsFile', (fileData) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === fileData.columnId) {
                    return {
                        ...e, tasks: e.tasks.map(e => {
                            if (e._id === fileData.taskId) {
                                return { ...e, attachments: [...e.attachments, fileData.nameFile] }
                            }
                            return e
                        })
                    }
                }
                return e
            }))
        });
        socket.on('deleteAttachmentsFile', (fileData) => { //  Добавление колонки
            setColumns(prevColumns => prevColumns.map(e => {
                if (e._id === fileData.columnId) {
                    return {
                        ...e, tasks: e.tasks.map(e => {
                            if (e._id === fileData.taskId) {
                                return { ...e, attachments: e.attachments.filter(e => e.filename !== fileData.removedAttachment.filename) }
                            }
                            return e
                        })
                    }
                }
                return e
            }))
        });
        return () => {
            socket.disconnect();
        };
    }, [boardId]);

    return (
        <div className='board_container'>
            {boardId &&
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
                </div>}
        </div>
    );
}