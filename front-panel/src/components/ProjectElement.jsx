import { useState, useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteMemberFromProject, updateProject } from "../api/response/projectResponse.js";
import { deleteProject } from "../api/response/projectResponse.js"
import styles from '../../styles/ProjectElement.module.css'
import ContextMenu from "../UI/ContextMenu/ContextMenu.jsx";
import Modal from "../UI/Modal/Modal.jsx";
import { fetchUsers } from "../api/response.js";
import Input from "../UI/Input/Input.jsx"
import Button from "../UI/Button/Button.jsx";

export default function ProjectElement({ project }) {

    const contextProjectElemntMenu = useRef()
    const [isMouse, setIsMouse] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [projectTitle, setProjectTitle] = useState(project.title)
    const [projectMembers, setProjectMembers] = useState(project.members)
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([])

    const removeUserByProject = (userId) => {
        setProjectMembers(prevProjectMembers => prevProjectMembers.filter(e => e._id !== userId))
    }

    useMemo(() => {
        searchTerm
            ? setSearchResults(users.filter(e => e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase())))
            : setSearchResults([])
    }, [searchTerm, projectMembers])

    useEffect(() => {
        fetchUsers(setUsers)
    }, []);

    return (
        <div className={styles.project} key={project._id}>
            <div className={styles.link_and_context_menu}>
                <Link className={styles.link_to_project} to={`/project/${project._id}`}>
                    {project.title}
                </Link>
                {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                    <ContextMenu tabIndex={0} className={styles.menu} onClick={() => setIsMouse(true)}>
                        <button className={styles.button} onClick={() => deleteProject(project._id)}>Удалить</button>
                        <button className={styles.button} onClick={() => setModalActive(true)}>Редактировать</button>
                    </ContextMenu>
                }
            </div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <>
                    <div className={styles.members}>
                        <div>Участники проекта</div>
                        <div>{project.members.map(e =>
                            <div className={styles.project_element_member} key={e._id}>
                                {e.secondname}
                                <img onClick={() => deleteMemberFromProject(project._id, e._id)} className={styles.trash} src="./media/trash.svg" alt="Мусорка" />
                            </div>)}
                        </div>
                    </div>
                    <Modal active={modalActive} setActive={setModalActive} className={styles.create_project_modal}>
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
                                        {projectMembers.map(e => <div className={styles.project_user}>
                                            <div key={e._id}>{e?.secondname} {e?.firstname}</div>
                                            <img onClick={() => removeUserByProject(e._id)} className={styles.trash} src="./media/trash.svg" alt="Мусорка" />
                                        </div>)}
                                    </div>
                                </div>
                                <Button
                                    // className={styles.create_project_button}
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