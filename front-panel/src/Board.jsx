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

    }, [boardId]);

    useEffect(() => {
        const socket = io();
        socket.on('connect', () => {
            console.log("connected to the server ");
            columns.forEach(column => {
                socket.emit('joinBoard', column._id)
            })
        })
    //     socket.on('updateTask', (updatedTask) => {
    //         setTask(prevTasks =>
    //             prevTasks.map(task =>
    //                 task._id === updatedTask._id ? updatedTask : task
    //             ))
    //         setColumns((prevColumns) =>
    //             prevColumns.map((column) =>
    //                 column._id === updatedTask.columnId
    //                     ? {
    //                         ...column,
    //                         tasks: column.tasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
    //                     }
    //                     : column
    //             ))
    //     });
    //     // Handle adding a task in realtime
    //     socket.on('addTask', (newTask) => {
    //         setColumns(prevColumns =>
    //             prevColumns.map(column =>
    //                 column._id === newTask.columnId
    //                     ? { ...column, tasks: [...column.tasks, newTask] }
    //                     : column
    //             )
    //         );
    //     });
        // return () => {
        //     socket.disconnect()
        // };
    }, []);

    return (
        <div >
            <div className="board_columns">
                {columns.data?.map((column) => (
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