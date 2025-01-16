import React, { useEffect, useMemo, useRef, useState } from "react";
import { deleteTask, editTaskTitle, fetchUsers, assignTask, unassignTask, handleFileUpload, handleDeleteAttachment, editTaskDescription, addTuskDate } from './api/response';
import "./Task.css"
import Modal from "./UI/Modal/Modal";
import { useParams } from "react-router-dom";
import ContextMenu from "./UI/ContextMenu/ContextMenu";

export default function Task({ task }) {

    const [modalActive, setModalActive] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [editTaskName, setEditTaskName] = useState(false)
    const [editingTaskDescription, setEditingTaskDescription] = useState(false)
    const [users, setUsers] = useState([]);
    const [isMouse, setIsMouse] = useState(false)
    const [editDate, setEditDate] = useState(false)
    const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
    const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const [newDates, setNewDates] = useState({ newStartDate: task.startDate ? task.startDate : null, newEndDate: task.endDate ? task.endDate : null })
    const [progress, setProgress] = useState(0)
    const [progressBarColor, setProgressBarColor] = useState('')
    const contextElementRef = useRef()
    const { projectId } = useParams()

    useMemo(() => {
        const now = new Date().getTime();
        if (now < startDate) {
            setProgress(0)
            return;
        }

        if (now >= endDate) {
            setProgress(100)
            return;
        }
        const totalTime = endDate - startDate;
        const elapsedTime = now - startDate;

        const progressValue = (elapsedTime / totalTime) * 100;
        setProgress(progressValue > 100 ? 100 : progressValue)
        if (progress < 30) setProgressBarColor('#00ff00');
        if (progress < 70 && progress > 30) setProgressBarColor('#007bff');
        if (progress > 70) setProgressBarColor('#ff0000');
    }, [startDate, endDate, progress])

    useEffect(() => {
        setStartDate(task.startDate ? new Date(task.startDate) : null)
        setEndDate(task.endDate ? new Date(task.endDate) : null)
    }, [task]);

    useEffect(() => {
        fetchUsers(setUsers)
    }, []);

    return (
        <div className="task" >
            <div onClick={() => setModalActive(true)}>
                <div className="task_name">{task.title}</div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%`, backgroundColor: `${progressBarColor}` }}
                    ></div>
                </div>
            </div>
            {modalActive && <Modal active={modalActive} setActive={setModalActive}>
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
                            <label className="delete_task" htmlFor={`task_file_${task._id}`}>Загрузить файл</label>
                            <input style={{ opacity: 0, height: 0, width: 0, position: "absolute" }} multiple id={`task_file_${task._id}`} name={`task_file_${task._id}`} type="file" className="delete_task" onChange={e => handleFileUpload(e, task._id, projectId)} />
                        </div>
                        <div>
                            {task.attachments && task.attachments.map((attachment) => (
                                <div key={attachment.filename}>
                                    <a href={`http://${window.location.hostname}:8080/api/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer" download={attachment.originalname}>
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
                    {isMouse && <ContextMenu
                        onMouseLeave={() => setIsMouse(false)}
                        refelement={contextElementRef}
                        corectx={-220}
                        corecty={-195}
                    >
                        <button onClick={() => deleteTask(task._id, projectId)} className="delete_task">Удалить задчу</button>
                        <button onClick={() => {
                            setEditTaskName(true)
                            setTaskName(task.title)
                        }} className="delete_task">Редактировать задачу</button>
                    </ContextMenu>}
                </div>
                {(startDate && endDate) ?
                    <>
                        {editDate
                            ?
                            <div className="task_date">
                                <input onChange={e => setNewDates(prevNewDates => ({ ...prevNewDates, newStartDate: e.target.value }))} type="date" name="" id="" />
                                <input onChange={e => setNewDates(prevNewDates => ({ ...prevNewDates, newEndDate: e.target.value }))} type="date" name="" id="" />
                                <button onClick={() => {
                                    addTuskDate(projectId, task._id, newDates.newStartDate, newDates.newEndDate)
                                    setEditDate(false)
                                }}>Назначить даты</button>
                            </div>
                            :
                            <div className="task_date">
                                <div >{startDate?.getDate()}.{startDate?.getMonth() + 1 < 10 ? <>0{startDate?.getMonth() + 1}</> : startDate?.getMonth() + 1}.{startDate?.getFullYear()}</div>
                                <div >{endDate?.getDate()}.{endDate?.getMonth() + 1 < 10 ? <>0{endDate?.getMonth() + 1}</> : endDate?.getMonth() + 1}.{endDate?.getFullYear()}</div>
                                {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                                    <button onClick={() => setEditDate(true)}>Изменить даты</button>
                                }
                            </div>
                        }
                    </>
                    :
                    <div className="task_date">
                        <input onChange={e => setStartDate(e.target.value)} type="date" name="" id="" />
                        <input onChange={e => setEndDate(e.target.value)} type="date" name="" id="" />
                        <button onClick={() => addTuskDate(projectId, task._id, startDate, endDate)}>Назначить даты</button>
                    </div>
                }
            </Modal>}
        </div >
    )
}