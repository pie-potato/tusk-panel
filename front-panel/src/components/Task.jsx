import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers } from '../api/response';
import { deleteTask, editTaskTitle, assignTask, unassignTask, handleFileUpload, handleDeleteAttachment, editTaskDescription, addTuskDate } from "../api/response/taskResponse"
import styles from "../../styles/Task.module.css"
import Modal from "../UI/Modal/Modal";
import { useParams } from "react-router-dom";
import ContextMenu from "../UI/ContextMenu/ContextMenu";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";

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
    const [assignTaskDate, setAssignTaskDate] = useState(false)
    const [newDates, setNewDates] = useState({ newStartDate: task.startDate ? task.startDate : null, newEndDate: task.endDate ? task.endDate : null })
    const [progress, setProgress] = useState(0)
    const [progressBarColor, setProgressBarColor] = useState('')
    const contextElementRef = useRef()
    const { projectId } = useParams()
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useMemo(() => {
        searchTerm
            ? setSearchResults(users.filter(e => e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase())))
            : setSearchResults([])
    }, [searchTerm])

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
        <div className={styles.task} >
            <div onClick={() => setModalActive(true)}>
                <div className={styles.task_name}>{task.title}</div>
                <div className={styles.progress_bar}>
                    <div
                        className={styles.progress_bar_fill}
                        style={{ width: `${progress}%`, backgroundColor: `${progressBarColor}` }}
                    ></div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive} className={styles.task_modal}>
                <div className={styles.modal_shadow}>
                    <div className={styles.title_header}>
                        <div className={styles.modal_title}>Название задачи</div>
                        <ContextMenu>
                            <Button onClick={() => deleteTask(task._id, projectId)} className={styles.delete_task}>Удалить задчу</Button>
                            <Button onClick={() => {
                                setEditTaskName(true)
                                setTaskName(task.title)
                            }} className={styles.delete_task}>Редактировать задачу</Button>
                        </ContextMenu>
                    </div>
                    <div className={styles.container_task_modal}>
                        {editTaskName
                            ? <textarea
                                type="text"
                                className={styles.text}
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
                            }} className={styles.task_name}>
                                {task.title}
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.modal_shadow}>
                    <div className={styles.modal_title}>Описание задачи</div>
                    <div className={styles.container_task_modal}>
                        {editingTaskDescription
                            ? <textarea
                                type="text"
                                className={styles.text}
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
                                }} className={styles.task_name}>
                                    {task.description}
                                </div>
                                    : <textarea
                                        type="text"
                                        className={styles.text}
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
                <div className={styles.bottom_input}>
                    <div className={`${styles.attachments_file} ${styles.modal_shadow}`}>
                        <div className={styles.title_header}>
                            <div className={styles.modal_title}>Прикрепленные файлы</div>
                            <label className={styles.delete_task} htmlFor={`task_file_${task._id}`}>Загрузить файл</label>
                            <input style={{ opacity: 0, height: 0, width: 0, position: "absolute" }} multiple id={`task_file_${task._id}`} name={`task_file_${task._id}`} type="file" className={styles.delete_task} onChange={e => handleFileUpload(e, task._id, projectId)} />
                        </div>
                        <div>
                            {task.attachments && task.attachments.map((attachment) => (
                                <div key={attachment.filename}>
                                    <a href={`http://${process.env.PUBLIC_BACKEND_URL}/api/task/uploads/${attachment.filename}`} target="_blank" rel="noopener noreferrer" download={attachment.originalname}>
                                        {attachment.originalname}
                                    </a>
                                    <button className={styles.delete_task} onClick={() => handleDeleteAttachment(attachment.filename, task, projectId)}>Удалить</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.modal_shadow}>
                        <div className={styles.modal_title}>Исполнители задачи</div>
                        <div className={styles.user_search}>
                            <div>
                                <Input
                                    type="text"
                                    className={styles.task_assign_input}
                                    placeholder="Найти сотрудника..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <div className={styles.find}>
                                    {searchResults.map(e => {
                                        return <div
                                            onClick={() => assignTask(task._id, e._id, projectId)}
                                            className='project_user'
                                            key={e._id}
                                        >
                                            {e?.secondname} {e?.firstname}
                                        </div>
                                    })}
                                </div>
                            </div>
                            {task?.assignedTo && task.assignedTo.map(e => <div key={e._id}>{e?.firstname || e?.username} <img onClick={() => unassignTask(task._id, e._id, projectId)} src="/media/trash.svg"/></div>)}
                        </div>
                    </div>
                </div>
                {assignTaskDate || (task.startDate && task.endDate) ?
                    <>
                        {editDate
                            ?
                            <div className={styles.task_date}>
                                <Input onChange={e => setNewDates(prevNewDates => ({ ...prevNewDates, newStartDate: e.target.value }))} type="date" name="" id="" />
                                <Input onChange={e => setNewDates(prevNewDates => ({ ...prevNewDates, newEndDate: e.target.value }))} type="date" name="" id="" />
                                <Button onClick={() => {
                                    addTuskDate(projectId, task._id, newDates.newStartDate, newDates.newEndDate)
                                    setEditDate(false)
                                }}>Назначить даты</Button>
                            </div>
                            :
                            <div className={styles.task_date}>
                                <div >{startDate?.getDate()}.{startDate?.getMonth() + 1 < 10 ? <>0{startDate?.getMonth() + 1}</> : startDate?.getMonth() + 1}.{startDate?.getFullYear()}</div>
                                <div >{endDate?.getDate()}.{endDate?.getMonth() + 1 < 10 ? <>0{endDate?.getMonth() + 1}</> : endDate?.getMonth() + 1}.{endDate?.getFullYear()}</div>
                                {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                                    <Button onClick={() => setEditDate(true)}>Изменить даты</Button>
                                }
                            </div>
                        }
                    </>
                    :
                    <div className={styles.task_date}>
                        <input onChange={e => setStartDate(new Date(e.target.value))} type="date" name="" id="" />
                        <input onChange={e => setEndDate(new Date(e.target.value))} type="date" name="" id="" />
                        <Button onClick={() => {
                            addTuskDate(projectId, task._id, startDate, endDate)
                            setAssignTaskDate(true)
                        }}>Назначить даты</Button>
                    </div>
                }
            </Modal>
        </div >
    )
}