import Modal from "../UI/Modal/Modal";
import styles from "../../styles/Task.module.css"
import { useEffect, useMemo, useState } from "react";
import { deleteTask, editTaskTitle, assignTask, unassignTask, handleDeleteAttachment, editTaskDescription, addTuskDate, uploadFile } from "../api/response/taskResponse";
import { useChat } from "../contexts/ChatContext";
import { useModal } from "../contexts/ModalContext";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import ContextMenu from "../UI/ContextMenu/ContextMenu";
import { fetchUsers } from "../api/response/userResponse";
import { createChat } from "../api/response/chatresponse";
import ConfirmDelete from "../UI/ConfirmDelete.jsx/ConfirmDelete";

const TaskModal = () => {

    const [taskName, setTaskName] = useState('')
    const [users, setUsers] = useState([]);
    const [taskDescription, setTaskDescription] = useState('')
    const [editTaskName, setEditTaskName] = useState(false)
    const [editingTaskDescription, setEditingTaskDescription] = useState(false)
    const [editDate, setEditDate] = useState(false)
    const [assignTaskDate, setAssignTaskDate] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const { openChat } = useChat();
    const { isOpen, task, projectId, closeModal } = useModal()
    const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
    const [confirm, setConfirm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');

    const closeConfirm = () => setConfirm(false)

    useMemo(() => {
        searchTerm
            ? setSearchResults(users.filter(e => e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase())))
            : setSearchResults([])
    }, [searchTerm])

    // const createChat = async (taskId) => {
    //     try {

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    const deleteActiveTask = async () => {
        await deleteTask(task?._id, projectId)
        closeModal()
    }

    const getUsers = async () => {
        const users = await fetchUsers()
        setUsers(users.data)
    }

    const fileTaskUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return alert('Ошибка загрузки файла');
        const formData = new FormData();
        formData.append('file', file);
        uploadFile(formData, task?._id, projectId)
    }

    useEffect(() => {
        setStartDate(task?.startDate ? new Date(task?.startDate) : null)
        setEndDate(task?.endDate ? new Date(task?.endDate) : null)
    }, [task]);

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <Modal active={isOpen} setActive={closeModal} childrenClass={styles.task_modal}>
            <div className={styles.modal_shadow}>
                <div className={styles.title_header}>
                    <div className={styles.modal_title}>Название задачи</div>
                    <ContextMenu>
                        <Button
                            onClick={() => setConfirm(true)}
                        >
                            Удалить задчу
                            <ConfirmDelete confirm={confirm} setConfirm={setConfirm} deleteFunc={deleteActiveTask}/>
                        </Button>
                        <Button onClick={() => {
                            setEditTaskName(true)
                            setTaskName(task?.title)
                        }}
                        >
                            Редактировать задачу
                        </Button>
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
                                    editTaskTitle(task?._id, taskName, projectId)
                                    setEditTaskName(false)
                                }
                            }}
                            onBlur={() => setEditTaskName(false)}>
                        </textarea>
                        :
                        <div onDoubleClick={() => {
                            setTaskName(task?.title)
                            setEditTaskName(true)
                        }} className={styles.task_name}>
                            {task?.title}
                        </div>
                    }
                </div>
            </div>
            <div className={styles.modal_shadow}>
                <div className={styles.title_header}>
                    <div className={styles.modal_title}>Описание задачи</div>
                    <div>{
                        task?.chatId
                            ?
                            <Button onClick={() => openChat(projectId, task?.chatId)}>
                                Октрыть чат
                            </Button>
                            :
                            <Button onClick={() => createChat(projectId, task._id)}>
                                Создать чат
                            </Button>
                    }</div>
                </div>
                <div className={styles.container_task_modal}>
                    {editingTaskDescription
                        ? <textarea
                            type="text"
                            className={styles.text}
                            value={taskDescription}
                            onChange={event => setTaskDescription(event.target.value)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    editTaskDescription(task?._id, taskDescription, projectId)
                                    setEditingTaskDescription(false)
                                }
                            }}
                            onBlur={() => setEditingTaskDescription(false)}>
                        </textarea>
                        :
                        <>
                            {task?.description ? <div onDoubleClick={() => {
                                setTaskDescription(task?.description)
                                setEditingTaskDescription(true)
                            }} className={styles.task_name}>
                                {task?.description}
                            </div>
                                : <textarea
                                    type="text"
                                    className={styles.text}
                                    value={taskDescription}
                                    onChange={event => setTaskDescription(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key === "Enter") {
                                            editTaskDescription(task?._id, taskDescription, projectId)
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
                        <label className={styles.delete_task} htmlFor={`task_file_${task?._id}`}>Загрузить файл</label>
                        <input style={{ opacity: 0, height: 0, width: 0, position: "absolute" }} multiple id={`task_file_${task?._id}`} name={`task_file_${task?._id}`} type="file" className={styles.delete_task} onChange={e => fileTaskUpload(e)} />
                    </div>
                    <div>
                        {task?.attachments && task?.attachments.map((attachment) => (
                            <div key={attachment.filename}>
                                <a href={`${process.env.PUBLIC_BACKEND_URL}/api/task/uploads/${attachment?.filename}`} rel="noopener noreferrer" download={attachment.originalname}>
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
                                        onClick={() => assignTask(task?._id, e._id, projectId)}
                                        className='project_user'
                                        key={e._id}
                                    >
                                        {e?.secondname} {e?.firstname}
                                    </div>
                                })}
                            </div>
                        </div>
                        {task?.assignedTo && task?.assignedTo.map(e => <div key={e._id}>{e?.firstname || e?.username} <img onClick={() => unassignTask(task?._id, e._id, projectId)} src="/media/trash.svg" /></div>)}
                    </div>
                </div>
            </div>
            {assignTaskDate || (task?.startDate && task?.endDate) ?
                <>
                    {editDate
                        ?
                        <div className={styles.task_date}>
                            <Input value={startDate?.toLocaleDateString().split('.').reverse().join('-')} onChange={e => setStartDate(new Date(e.target.value))} type="date" name="" id="" />
                            <Input value={endDate?.toLocaleDateString().split('.').reverse().join('-')} onChange={e => setEndDate(new Date(e.target.value))} type="date" name="" id="" />
                            <Button onClick={() => {
                                addTuskDate(projectId, task?._id, startDate, endDate)
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
                    <Input onChange={e => setStartDate(new Date(e.target.value))} type="date" name="" id="" />
                    <Input onChange={e => setEndDate(new Date(e.target.value))} type="date" name="" id="" />
                    <Button onClick={() => {
                        addTuskDate(projectId, task?._id, startDate, endDate)
                        setAssignTaskDate(true)
                    }}>Назначить даты</Button>
                </div>
            }
        </Modal>
    );
}

export default TaskModal;
