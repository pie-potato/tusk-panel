import React, { useState, useEffect, useMemo } from 'react';
import { fetchUsers } from './api/response';
import { fetchProjects, createProject } from './api/response/projectResponse.js'
import { useSocket } from './WebSocketContext';
import { useLocation } from 'react-router-dom';
import './ProjectsList.css'
import ProjectElement from './ProjectElement';
import Modal from './UI/Modal/Modal';

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
            console.log(deletedProject);
            setProjects(prevProjects => prevProjects.filter(e => e._id !== deletedProject._id))
        })
        socket.on('updateProject', (updateProject) => {
            console.log(updateProject);
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

    useEffect(() => {
        fetchProjects(setProjects);
        fetchUsers(setUsers)
    }, []);

    return (
        <div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                modalActive && <Modal active={modalActive} setActive={setModalActive}>
                    <div className='create_project'>
                        <textarea
                            type="text"
                            className='project_name'
                            value={projectTitle}
                            onChange={e => setProjectTitle(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    createProject(projectTitle, projectMembers)
                                    setProjectTitle('')
                                }
                            }}
                        />
                        <div className='create_project_bottom'>
                            <div className='searced_users'>
                                <div className='search_users'>
                                    <input
                                        type="text"
                                        className='input_search_users'
                                        placeholder="Найти сотрудника..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <div>
                                        {searchResults.map(e => {
                                            return <div
                                                onClick={() => setProjectMembers(prevProjectMembers => [...prevProjectMembers, e])}
                                                className='project_user'
                                                key={e._id}
                                            >
                                                {e?.secondname} {e?.firstname}
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div>
                                    {projectMembers.map(e => <div className='project_user'>
                                        <div key={e._id}>{e?.secondname} {e?.firstname}</div>
                                        <img onClick={() => removeUserByProject(e._id)} className="trash" src="./media/trash.svg" alt="Мусорка" />
                                    </div>)}
                                </div>
                            </div>
                            <button
                                className='create_project_button'
                                onClick={() => {
                                    createProject(projectTitle, projectMembers)
                                    setProjectTitle('')
                                }}>Сохранить</button>
                        </div>
                    </div>
                </Modal>
            }
            <h2 className='projects_h2'>Проекты</h2>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <button className='create_project_button' onClick={() => setModalActive(true)}>Создать проект</button>}
            <div className='projects'>
                {projects.map(e => <ProjectElement key={e._id} project={e} />)}
            </div>
        </div>
    );
}