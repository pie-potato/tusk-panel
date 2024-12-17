import React, { useState, useEffect } from 'react';
import Column from './Column';
import { getColumnByIdBoard, addColumn } from './api/response';
import { io } from "socket.io-client";

export default function Board({ boardId, columns }) {
    const [newColumnName, setNewColumnName] = useState('');


    return (
        <div className='board_container'>
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