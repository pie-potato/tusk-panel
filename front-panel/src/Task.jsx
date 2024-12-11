import React, { useEffect, useRef, useState } from "react";
import { deleteTask, handleTaskEditSave, fetchUsers, assignTask, unassignTask } from './api/response';
import "./Task.css"

export default function Task({ task }) {

    const [taskName, setTaskName] = useState(task.title)
    const [editTask, setEditTask] = useState(false)
    const [users, setUsers] = useState([]);
    const [isMouse, setIsMouse] = useState(false)
    const contextElementRef = useRef()
// console.log(task);

    useEffect(() => {
        fetchUsers(setUsers);
        // console.log(task);
    }, []);

    return (
        <div key={task._id} className="task">
            <div className="container_task">
                {editTask
                    ? <textarea
                        type="text"
                        className="text"
                        value={taskName}
                        onChange={event => setTaskName(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                handleTaskEditSave(task._id, taskName)
                                setEditTask(false)
                            }
                        }}
                        onBlur={() => setEditTask(false)}>
                    </textarea>
                    :
                    <div onDoubleClick={() => setEditTask(true)} className="task_name">
                        {taskName}
                    </div>


                }
                <div onMouseDown={() => setIsMouse(true)} className="context_menu_button" ref={contextElementRef}>...</div>
            </div>
            <div>
                {task.assignedTo?.username
                    ? <div>Задача назначена на: {task.assignedTo?.firstname || task.assignedTo?.username} <button onClick={() => unassignTask(task._id)}>Снять задачу</button></div>
                    : <select onChange={(e) => {
                        console.log(e.target.value)
                        assignTask(task._id, e.target.value)
                    }}>
                        <option value="">Назначить на:</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user?.secondname || user.username} {user?.firstname && user?.firstname[0] + '.'} {user?.thirdname && user?.thirdname[0] + '.'}
                            </option>
                        ))}
                    </select>
                }
                <div>Создатель задачи: {<>{task.createdBy?.secondname} {task.createdBy?.firstname[0]+'.'}</> || task.createdBy?.username || 'Unknown'}</div>
                {isMouse && <div onMouseLeave={() => setIsMouse(false)} className="context_menu" style={{ transform: `translate(${contextElementRef.current.getBoundingClientRect().left + 5}px, ${contextElementRef.current.getBoundingClientRect().top + 22}px)` }}>
                    <button onClick={() => deleteTask(task._id)} className="delete_task">Удалить задчу</button>
                    <button onClick={() => setEditTask(true)} className="delete_task">Редактировать задачу</button>
                </div>
                }
            </div>
        </div>
    )
}