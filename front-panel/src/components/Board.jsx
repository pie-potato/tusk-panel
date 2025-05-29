import { useState, useEffect } from 'react';
import Column from './Column';
import { getColumnByIdBoard, addColumn } from '../api/response/columnResponse';
import { useParams } from 'react-router-dom';
import { useSocket } from '../WebSocketContext';
import "../../styles/Board.css"

export default function Board({ boardId }) {
    const [newColumnName, setNewColumnName] = useState('');
    const [columns, setColumns] = useState([]);
    const [addColumnInput, setAddColumnInput] = useState(false)
    const { socket } = useSocket()
    const { projectId } = useParams()

    const responseColumnById = async (boardId) => {
        const response = await getColumnByIdBoard(boardId)
        setColumns(response.data)
    }

    useEffect(() => {
        if (!socket) return;
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
                                return { ...e, assignedTo: e.assignedTo.filter(e => e._id !== updatedTask.assignedTo) }
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
            socket.off();
        };
    }, [socket])

    useEffect(() => {
        if (!boardId) return;
        responseColumnById(boardId)
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
                            {addColumnInput
                                ? <div className='add_column'>
                                    <input
                                        type="text"
                                        className='add_column_input'
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                        placeholder="Добавить колонку..."
                                        onKeyDown={event => {
                                            if (event.key === "Enter") {
                                                addColumn(newColumnName, setNewColumnName, boardId, localStorage.getItem('user'), projectId)
                                                setAddColumnInput(false)
                                            }
                                        }}
                                    />
                                    <div className='add_task' onClick={() => {
                                        addColumn(newColumnName, setNewColumnName, boardId, localStorage.getItem('user'), projectId)
                                        setAddColumnInput(false)
                                    }}>+</div>
                                </div>
                                : <button className='add_task' onClick={() => setAddColumnInput(true)}>Добавить колонку</button>
                            }
                        </div>
                    </div>
                </div>}
        </div>
    );
}