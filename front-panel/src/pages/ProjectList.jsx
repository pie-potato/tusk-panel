import { useState, useEffect, useMemo } from 'react';
import { fetchUsers } from '../api/response/userResponse.js';
import { fetchProjects, createProject } from '../api/response/projectResponse.js'
import { useSocket } from '../contexts/WebSocketContext.jsx';
import { useLocation } from 'react-router-dom';
import styles from '../../styles/ProjectsList.module.css'
import ProjectElement from '../components/ProjectElement.jsx';
import Modal from '../UI/Modal/Modal.jsx';
import Button from '../UI/Button/Button.jsx';

export default function ProjectList() {
    const [projects, setProjects] = useState([])
    const [projectTitle, setProjectTitle] = useState([])
    const [users, setUsers] = useState([])
    const [projectMembers, setProjectMembers] = useState([])
    const { socket, isConnected, joinRoom, leaveRoom } = useSocket()
    const [modalActive, setModalActive] = useState(false)
    const { pathname } = useLocation()
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useMemo(() => {
        searchTerm
            ? setSearchResults(users.filter(e => e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase())))
            : setSearchResults([])
    }, [searchTerm, projectMembers])

    useEffect(() => {
        if (isConnected && pathname) {
            joinRoom(pathname);
        }
        return () => {
            if (pathname) {
                leaveRoom(pathname);
            }
        }
    }, [isConnected, pathname, joinRoom, leaveRoom]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on('addProject', (newProject) => {
            setProjects(prevProjects => [...prevProjects, newProject])
        })
        socket.on('deleteProject', (deletedProject) => {
            setProjects(prevProjects => prevProjects.filter(e => e._id !== deletedProject._id))
        })
        socket.on('updateProject', (updateProject) => {
            setProjects(prevProjects => prevProjects.map(e => {
                if (e._id === updateProject._id) {
                    return updateProject
                }
                return e
            }))
        })
        return () => {
            socket.off()
        }
    }, [socket])

    const removeUserByProject = (userId) => {
        setProjectMembers(prevProjectMembers => prevProjectMembers.filter(e => e._id !== userId))
    }

    const getAllProject = async () => {
        const projects = await fetchProjects()
        setProjects(projects.data)
    }

    const getUsers = async () => {
        const users = await fetchUsers()
        setUsers(users.data)
    }

    useEffect(() => {
        getAllProject()
        getUsers()
    }, []);

    return (
        <div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <Modal active={modalActive} setActive={setModalActive}>
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
                                    <input
                                        type="text"
                                        className={styles.input_search_users}
                                        placeholder="Найти сотрудника..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <div>
                                        {searchResults.map(e => {
                                            return <div
                                                onClick={() => setProjectMembers(prevProjectMembers => [...prevProjectMembers, e])}
                                                className={styles.project_user}
                                                key={e._id}
                                            >
                                                {e?.secondname} {e?.firstname}
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div>
                                    {projectMembers.map(e => <div className={styles.project_user}>
                                        <div key={e._id}>{e?.secondname} {e?.firstname}</div>
                                        <img onClick={() => removeUserByProject(e._id)} className={styles.trash} src="./media/trash.svg" alt="Мусорка" />
                                    </div>)}
                                </div>
                            </div>
                            <button
                                className={styles.create_project_button}
                                onClick={() => {
                                    createProject(projectTitle, projectMembers)
                                    setProjectTitle('')
                                }}>Сохранить</button>
                        </div>
                    </div>
                </Modal>
            }
            <h1 className={styles.projects_h1}>Проекты</h1>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <Button onClick={() => setModalActive(true)}>Создать проект</Button>}
            <div className={styles.projects}>
                {projects.map(e => <ProjectElement key={e._id} project={e} />)}
            </div>
        </div>
    );
}