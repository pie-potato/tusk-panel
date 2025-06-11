import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateProject } from "../api/response/projectResponse.js";
import { deleteProject } from "../api/response/projectResponse.js"
import styles from '../../styles/ProjectElement.module.css'
import ContextMenu from "../UI/ContextMenu/ContextMenu.jsx";
import Modal from "../UI/Modal/Modal.jsx";
import { fetchUsers } from "../api/response/userResponse.js";
import Input from "../UI/Input/Input.jsx"
import Button from "../UI/Button/Button.jsx";
import { useModal } from "../contexts/ModalContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";

export default function ProjectElement({ project }) {

    const [modalActive, setModalActive] = useState(false)
    const [projectTitle, setProjectTitle] = useState(project.title)
    const [projectMembers, setProjectMembers] = useState(project.members)
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([])
    const { confirmOpen } = useModal()
    const { user } = useUser()
    const removeUserByProject = (userId) => {
        setProjectMembers(prevProjectMembers => prevProjectMembers.filter(e => e._id !== userId))
    }

    const removeProject = () => deleteProject(project._id)

    const getUsers = async () => {
        const users = await fetchUsers()
        setUsers(users.data)
    }

    useMemo(() => {
        searchTerm
            ? setSearchResults(users.filter(e => (e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase())) && (e?._id !== projectMembers.find(user => user._id === e._id)?._id)))
            : setSearchResults([])
    }, [searchTerm, projectMembers])

    useEffect(() => {
        if (user === "admin" || user?.role === "manager") getUsers()
    }, []);

    return (
        <div className={styles.project} key={project._id}>
            <div className={styles.link_and_context_menu}>
                <Link className={styles.link_to_project} to={`/project/${project._id}`}>
                    {project.title}
                </Link>
                {(user?.role === "admin" || user?.role === "manager") &&
                    <ContextMenu tabIndex={0} className={styles.menu}>
                        <Button className={styles.button} onClick={() => confirmOpen(removeProject)}>Удалить</Button>
                        <Button className={styles.button} onClick={() => setModalActive(true)}>Редактировать</Button>
                    </ContextMenu>
                }
            </div>
            {(user?.role === "admin" || user?.role === "manager") &&
                <>
                    <div className={styles.members}>
                        <div>Участники проекта</div>
                        <div>{project.members.map(e =>
                            <div className={styles.project_member} key={e.username}>
                                {e.firstname} {e.secondname}
                            </div>)}
                        </div>
                    </div>
                    <Modal active={modalActive} setActive={setModalActive} childrenClass={styles.create_project_modal}>
                        <div className={styles.create_project}>
                            <textarea
                                type="text"
                                className={styles.project_name}
                                value={projectTitle}
                                onChange={e => setProjectTitle(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        createProject(projectTitle, projectMembers)
                                        setProjectTitle('')
                                    }
                                }}
                            />
                            <div className={styles.create_project_bottom}>
                                <div className={styles.searced_users}>
                                    <div className={styles.search_users}>
                                        <Input
                                            type="text"
                                            placeholder="Найти сотрудника..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                        <div className={searchResults.length !== 0 ? `${styles.users} ${styles.active}` : styles.users}>
                                            {searchResults.map(e =>
                                                <div
                                                    onClick={() => setProjectMembers(prevProjectMembers => [...prevProjectMembers, e])}
                                                    className={styles.project_user}
                                                    key={e._id}
                                                >
                                                    {e?.secondname} {e?.firstname}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {projectMembers.map(e =>
                                            <div className={styles.project_user} key={e.username}>
                                                <div key={e._id}>{e?.secondname} {e?.firstname}</div>
                                                <img onClick={() => removeUserByProject(e._id)} className={styles.trash} src="./media/trash.svg" alt="Мусорка" />
                                            </div>)}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        updateProject(project._id, projectTitle, projectMembers)
                                        setSearchTerm('')
                                        setModalActive(false)
                                    }}>Сохранить</Button>
                            </div>
                        </div>
                    </Modal>
                </>
            }
        </div>
    )
}