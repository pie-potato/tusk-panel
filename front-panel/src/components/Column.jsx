import { useState } from 'react';
import "../../styles/Column.css"
import { addTask } from "../api/response/taskResponse"
import { deleteColumn, handleColumnEditSave } from '../api/response/columnResponse';
import Task from './Task';
import { useParams } from 'react-router-dom';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import Input from '../UI/Input/Input';

export default function Column({ column }) {

    const [newTask, setNewTask] = useState({ columnId: null, title: '' });
    const [columnName, setColumnName] = useState('')
    const [editColumn, setEditColumn] = useState(false)
    const [active, setActive] = useState(false)
    const { projectId } = useParams()

    return (
        <div key={column._id} className="column">
            <div className="column_header">
                {editColumn
                    ?
                    <Input
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
                    :
                    <h2>{column.title}</h2>
                }
                <ContextMenu>
                    <Button onClick={() => setActive(true)}>Удалить</Button>
                    <Button onClick={() => {
                        setEditColumn(true)
                        setColumnName(column.title)
                    }}>Изменить</Button>
                </ContextMenu>
            </div>
            <div>
                {column.tasks.map((task) => (
                    <Task key={task._id} task={task} />
                ))}
            </div>
            <div>
                <Input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value, columnId: column._id })}
                    placeholder="Добавить задачу..."
                    onKeyDown={event => { if (event.key === "Enter") addTask(newTask, setNewTask, localStorage.getItem('user'), projectId) }}
                />
                <Button className='add_task' onClick={() => addTask(newTask, setNewTask, localStorage.getItem('user'), projectId)}>Добавить задачу</Button>
            </div>
            <Modal active={active} setActive={setActive} className="popup">
                <div>
                    Вы точно хотите удалить это?
                    Это действие нельзя будет отменить
                </div>
                <div>
                    <Button onClick={() => setActive(false)}>
                        Нет, отменить
                    </Button>
                    <Button onClick={() => deleteColumn(column._id, projectId)}>
                        Да, удалить
                    </Button>
                </div>
            </Modal>
        </div>
    )
}