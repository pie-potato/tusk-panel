import React, { useEffect, useRef, useState } from "react";
import { deleteTask, handleTaskEditSave, fetchUsers, assignTask, unassignTask, handleFileUpload, handleDeleteAttachment } from './api/response';
import "./Task.css"

export default function Task({ task }) {

    const [taskName, setTaskName] = useState('')
    const [editTask, setEditTask] = useState(false)
    const [users, setUsers] = useState([]);
    const [isMouse, setIsMouse] = useState(false)
    const [uploadFile, setUploadFile] = useState(false)
    const contextElementRef = useRef()
    // console.log(task);

    useEffect(() => {
        fetchUsers(setUsers);
        // console.log(task);

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
                    <div onDoubleClick={() => {
                        setTaskName(task.title)
                        setEditTask(true)
                        }} className="task_name">
                        {task.title}
                    </div>


                }
                <div onMouseDown={() => setIsMouse(true)} className="context_menu_button" ref={contextElementRef}>...</div>
            </div>
            <div className="bottom_input">
                {task.assignedTo?.username
                    ? <div>Задача назначена на: {task.assignedTo?.firstname || task.assignedTo?.username} <button onClick={() => unassignTask(task._id)}>Снять задачу</button></div>
                    : <select className="select_users" onChange={(e) => {
                        console.log(e.target.value)
                        assignTask(task._id, e.target.value)
                    }}>
                        <option value="">Назначить на:</option>
                        {users.map((user) => (
                            <option className="user" key={user._id} value={user._id}>
                                {user?.secondname || user.username} {user?.firstname && user?.firstname[0] + '.'} {user?.thirdname && user?.thirdname[0] + '.'}
                            </option>
                        ))}
                    </select>
                }
                {task.attachments && task.attachments.map((attachment) => (
                    <div key={attachment.filename}>
                        <a href={`http://${window.location.hostname}:5000/api/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer" download={attachment.originalname}>
                            {attachment.originalname}
                        </a>
                        <button onClick={() => handleDeleteAttachment(attachment.filename, task)}>Delete</button>
                    </div>
                ))}
                {/* <div>Создатель задачи: {<>{task?.createdBy?.secondname} {task?.createdBy?.firstname[0] + '.'}</> || task?.createdBy?.username || 'Unknown'}</div> */}
                {isMouse && <div onMouseLeave={() => {
                    setIsMouse(false)
                }} className="context_menu" style={{ transform: `translate(${contextElementRef.current.getBoundingClientRect().left + 5}px, ${contextElementRef.current.getBoundingClientRect().top + 22}px)` }}>
                    <button onClick={() => deleteTask(task._id)} className="delete_task">Удалить задчу</button>
                    <button onClick={() => setEditTask(true)} className="delete_task">Редактировать задачу</button>
                    <button onClick={() => setUploadFile(true)} className="delete_task">Загрузить файл</button>
                </div>
                }
                {uploadFile && <div onMouseLeave={() => setUploadFile(false)} className="context_menu" style={{ transform: `translate(${contextElementRef.current.getBoundingClientRect().left + 5}px, ${contextElementRef.current.getBoundingClientRect().top + 121}px)` }}>
                    <input type="file" onChange={e => handleFileUpload(e, task)} />
                </div>}
                <button className="delete_task">n</button>
            </div>
        </div>
    )
}