import React, { useEffect, useRef, useState, useMemo } from "react";
import { deleteTask, editTaskTitle, fetchUsers, assignTask, unassignTask, handleFileUpload, handleDeleteAttachment, editTaskDescription } from './api/response';
import "./Task.css"
import Modal from "./Modal/Modal";
import { useParams } from "react-router-dom";


export default function Task({ task }) {

    const [modalActive, setModalActive] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [editTaskName, setEditTaskName] = useState(false)
    const [editingTaskDescription, setEditingTaskDescription] = useState(false)
    const [users, setUsers] = useState([]);
    const [isMouse, setIsMouse] = useState(false)
    const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
    const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const contextElementRef = useRef()
    const contextDateInputRef = useRef()
    const {projectId} = useParams()

    useEffect(() => {
        fetchUsers(setUsers);
    }, []);

    return (
        <div key={task._id} className="task" >
            <div className="container_task" onClick={() => setModalActive(true)}>
                <div className="task_name">{task.title}</div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className="modal_shadow">
                    <div className="title_header">
                        <div className="modal_title">Название задачи</div>
                        <div onMouseDown={() => setIsMouse(true)} className="context_menu_button" ref={contextElementRef}>...</div>
                    </div>
                    <div className="container_task_modal">
                        {editTaskName
                            ? <textarea
                                type="text"
                                className="text"
                                value={taskName}
                                onChange={event => setTaskName(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === "Enter") {
                                        editTaskTitle(task._id, taskName, projectId)
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
                    </div>
                </div>
                <div className="modal_shadow">
                    <div className="modal_title">Описание задачи</div>
                    <div className="container_task_modal">
                        {editingTaskDescription
                            ? <textarea
                                type="text"
                                className="text"
                                value={taskDescription}
                                onChange={event => setTaskDescription(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === "Enter") {
                                        editTaskDescription(task._id, taskDescription, projectId)
                                        setEditingTaskDescription(false)
                                    }
                                }}
                                onBlur={() => setEditingTaskDescription(false)}>
                            </textarea>
                            :
                            <>
                                {task?.description ? <div onDoubleClick={() => {
                                    setTaskDescription(task.description)
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
                                                editTaskDescription(task._id, taskDescription, projectId)
                                                setEditingTaskDescription(false)
                                            }
                                        }}
                                        onBlur={() => setEditingTaskDescription(false)}>
                                    </textarea>}
                            </>
                        }
                    </div>
                </div>
                <div className="bottom_input">
                    <div className="attachments_file modal_shadow">
                        <div className="title_header">
                            <div className="modal_title">Прикрепленные файлы</div>
                            <label className="delete_task" htmlFor="task_file">Загрузить файл</label>
                            <input style={{ opacity: 0, height: 0, width: 0, position: "absolute" }} multiple id="task_file" name="task_file" type="file" className="delete_task" onChange={e => handleFileUpload(e, task, projectId)} />
                        </div>
                        <div>
                            {task.attachments && task.attachments.map((attachment) => (
                                <div key={attachment.filename}>
                                    <a href={`http://${window.location.hostname}:5000/api/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer" download={attachment.originalname}>
                                        {attachment.originalname}
                                    </a>
                                    <button className="delete_task" onClick={() => handleDeleteAttachment(attachment.filename, task, projectId)}>Удалить</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal_shadow">
                        <div className="modal_title">Исполнители задачи</div>
                        {task?.assignedTo && task.assignedTo.map(e => <div key={e._id}>{e?.firstname || e?.username} <button onClick={() => unassignTask(task._id, e._id, projectId)}>Снять задачу</button></div>)}
                        <select className="select_users" onChange={(e) => {
                            console.log(e.target.value)
                            assignTask(task._id, e.target.value, projectId)
                        }}>
                            <option value="">Назначить на:</option>
                            {users.map((user) => (
                                <option className="user" key={user._id} value={user._id}>
                                    {user?.secondname || user.username} {user?.firstname && user?.firstname[0] + '.'} {user?.thirdname && user?.thirdname[0] + '.'}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div>Создатель задачи: {<>{task?.createdBy?.secondname} {task?.createdBy?.firstname[0] + '.'}</> || task?.createdBy?.username || 'Unknown'}</div> */}
                    {isMouse && <div onMouseLeave={() => {
                        setIsMouse(false)
                    }} className="context_menu" style={{ transform: `translate(${contextElementRef.current.getBoundingClientRect().left - 275}px, ${contextElementRef.current.getBoundingClientRect().top - 160}px)` }}>
                        <button onClick={() => deleteTask(task._id, projectId)} className="delete_task">Удалить задчу</button>
                        <button onClick={() => {
                            setEditTaskName(true)
                            setTaskName(task.title)
                        }} className="delete_task">Редактировать задачу</button>
                    </div>
                    }
                </div>
                <div>
                    <input ref={contextDateInputRef} onChange={e => setStartDate(e.target.value)} type="date" name="" id="" />
                </div>
            </Modal>
        </div>
    )
}