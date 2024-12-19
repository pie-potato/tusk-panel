import React, { useEffect, useRef, useState, useMemo } from "react";
import { deleteTask, editTaskTitle, fetchUsers, assignTask, unassignTask, handleFileUpload, handleDeleteAttachment, editTaskDescription } from './api/response';
import "./Task.css"
import Modal from "./Modal/Modal";

export default function Task({ task }) {

    const [modalActive, setModalActive] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [editTaskName, setEditTaskName] = useState(false)
    const [editingTaskDescription, setEditingTaskDescription] = useState(false)
    const [users, setUsers] = useState([]);
    const [isMouse, setIsMouse] = useState(false)
    const contextElementRef = useRef()

    useMemo(() => {
        console.log('aad');
        for (let i = 0; i < task?.assignedTo.length; i++) {
            setUsers(prevUsers => prevUsers.filter(e => e._id !== task?.assignedTo[i]._id))
        }
    }, [task.assignedTo])

    console.log(task.assignedTo, users);

    useEffect(() => {
        fetchUsers(setUsers);
    }, []);

    return (
        <div key={task._id} className="task">
            <div className="container_task" onClick={() => setModalActive(true)}>
                <div className="task_name">{task.title}</div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div>Название задачи</div>
                <div className="container_task_modal">
                    {editTaskName
                        ? <textarea
                            type="text"
                            className="text"
                            value={taskName}
                            onChange={event => setTaskName(event.target.value)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    editTaskTitle(task._id, taskName)
                                    setEditTaskName(false)
                                }
                            }}
                            onBlur={() => setEditTaskName(false)}>
                        </textarea>
                        :
                        <div onDoubleClick={() => {
                            setTaskName(task.title)
                            setEditTaskName(true)
                        }} className="task_name">
                            {task.title}
                        </div>
                    }
                    <div onMouseDown={() => setIsMouse(true)} className="context_menu_button" ref={contextElementRef}>...</div>
                </div>
                <div className="container_task_modal">
                    <div>Описание задачи</div>
                    {editingTaskDescription
                        ? <textarea
                            type="text"
                            className="text"
                            value={taskDescription}
                            onChange={event => setTaskDescription(event.target.value)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    editTaskDescription(task._id, taskDescription)
                                    setEditingTaskDescription(false)
                                }
                            }}
                            onBlur={() => setEditingTaskDescription(false)}>
                        </textarea>
                        :
                        <>
                            {task?.description ? <div onDoubleClick={() => {
                                setTaskName(task.title)
                                setEditingTaskDescription(true)
                            }} className="task_name">
                                {task.description}
                            </div>
                                : <textarea
                                    type="text"
                                    className="text"
                                    value={taskDescription}
                                    onChange={event => setTaskDescription(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key === "Enter") {
                                            editTaskDescription(task._id, taskDescription)
                                            setEditingTaskDescription(false)
                                        }
                                    }}
                                    onBlur={() => setEditingTaskDescription(false)}>
                                </textarea>}
                        </>
                    }
                </div>
                <div className="bottom_input">
                    <div>
                        <div>Исполнители задачи</div>
                        {task?.assignedTo && task.assignedTo.map(e => <div key={e._id}>{e?.firstname || e?.username} <button onClick={() => unassignTask(task._id, e._id)}>Снять задачу</button></div>)}
                        <select className="select_users" onChange={(e) => {
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

                    </div>
                    {task.attachments && task.attachments.map((attachment) => (
                        <div key={attachment.filename}>
                            <a href={`http://${window.location.hostname}:5000/api/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer" download={attachment.originalname}>
                                {attachment.originalname}
                            </a>
                            <button className="delete_task" onClick={() => handleDeleteAttachment(attachment.filename, task)}>Удалить</button>
                        </div>
                    ))}
                    {/* <div>Создатель задачи: {<>{task?.createdBy?.secondname} {task?.createdBy?.firstname[0] + '.'}</> || task?.createdBy?.username || 'Unknown'}</div> */}
                    {isMouse && <div onMouseLeave={() => {
                        setIsMouse(false)
                    }} className="context_menu" style={{ transform: `translate(${contextElementRef.current.getBoundingClientRect().left - 190}px, ${contextElementRef.current.getBoundingClientRect().top - 405}px)` }}>
                        <button onClick={() => deleteTask(task._id)} className="delete_task">Удалить задчу</button>
                        <button onClick={() => {
                            setEditTaskName(true)
                            setTaskName(task.title)
                        }} className="delete_task">Редактировать задачу</button>
                        {/* <button onClick={() => setUploadFile(true)} className="delete_task">Загрузить файл</button> */}
                        <label className="delete_task" htmlFor="task_file">Загрузить файл</label>
                        <input style={{ opacity: 0, height: 0, width: 0, position: "absolute" }} multiple id="task_file" name="task_file" type="file" className="delete_task" onChange={e => handleFileUpload(e, task)} />
                    </div>
                    }
                </div>
            </Modal>
        </div>
    )
}