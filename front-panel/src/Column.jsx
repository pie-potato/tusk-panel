import React, { useState } from 'react';
import "./Column.css"
import { addTask, deleteColumn, handleColumnEditSave } from './api/response';
import Task from './Task';
import { useParams } from 'react-router-dom';

export default function Column({ column }) {

    const [newTask, setNewTask] = useState({ columnId: null, title: '' });
    const [columnName, setColumnName] = useState('')
    const [editColumn, setEditColumn] = useState(false)
    const { projectId } = useParams()

    return (
        <div key={column._id} className="column">
            {editColumn
                ? <input
                    type="text"
                    value={columnName}
                    onChange={event => setColumnName(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            handleColumnEditSave(column._id, columnName, projectId)
                            setEditColumn(false)
                        }
                    }}
                />
                : <h2 onDoubleClick={() => {
                    setEditColumn(true)
                    setColumnName(column.title)
                }}>{column.title} <button className='delete_column' onClick={() => deleteColumn(column._id, projectId)}>Удалить колонку</button></h2>
            }
            <div>
                {column.tasks.map((task) => (
                    <Task key={task._id} task={task} />
                ))}
            </div>
            <div>
                <input
                    type="text"
                    className='input_task'
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value, columnId: column._id })}
                    placeholder="Добавить задачу..."
                    onKeyDown={event => { if (event.key === "Enter") addTask(newTask, setNewTask, localStorage.getItem('user'), projectId) }}
                />
                <button className='add_task' onClick={() => addTask(newTask, setNewTask, localStorage.getItem('user'), projectId)}>Добавить задачу</button>
            </div>
        </div>
    )
}