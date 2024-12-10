import React, { useState } from 'react';
import "./Column.css"
import { addTask, deleteColumn, handleColumnEditSave } from './api/response';
import Task from './Task';


export default function Column({ column }) {

    const [newTask, setNewTask] = useState({ columnId: null, title: '' });
    const [columnName, setColumnName] = useState(column.title)
    const [editColumn, setEditColumn] = useState(false)

    return (
        <div key={column._id} className="column">
            {editColumn
                ? <input
                    type="text"
                    value={columnName}
                    onChange={event => setColumnName(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            handleColumnEditSave(column._id, columnName)
                            setEditColumn(false)
                        }
                    }}
                />
                : <h2 onDoubleClick={() => setEditColumn(true)}>{columnName} <button onClick={() => deleteColumn(column._id)}>Удалить колонку</button></h2>
            }
            <div>
                {column.tasks.map((task) => (
                    <Task key={task._id} task={task} />
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value, columnId: column._id })}
                    placeholder="Добавить задачу..."
                    onKeyDown={event => { if (event.key === "Enter") addTask(newTask, setNewTask, localStorage.getItem('user')) }}
                />
                <button onClick={() => addTask(newTask, setNewTask, localStorage.getItem('user'))}>Добавить задачу</button>
            </div>
        </div>
    )
}