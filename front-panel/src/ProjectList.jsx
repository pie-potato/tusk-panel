import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchUsers, fetchProjects } from './api/response';
import { useSocket } from './WebSocketContext';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import './ProjectsList.css'


export default function ProjectList() {
    const [projects, setProjects] = useState([])
    const [projectTitle, setProjectTitle] = useState([])
    const [users, setUsers] = useState([])
    const [projectMembers, setProjectMembers] = useState([])
    const { socket, isConnected, joinRoom, leaveRoom } = useSocket()
    const { pathname } = useLocation()

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

    const deleteProject = async (projectId) => {
        try {
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
            await axios.delete(`http://${window.location.hostname}:5000/api/project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const createProject = async (title, members = []) => {
        await axios.post(`http://${window.location.hostname}:5000/api/projects`, { title: title, members: members })
    }

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
    // ... functions to create/edit projects (similar to boards/columns/tasks)
    return (
        <div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <div className='create_project'>
                    <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
                    <select className="select_users" onChange={(e) => {
                        setProjectMembers(prevProjectMembers => [...prevProjectMembers, JSON.parse(e.target.value)])
                    }}>
                        <option value="">Участники проекта</option>
                        {users.map((user) => (
                            <option className="user" key={user._id} value={JSON.stringify(user)}>
                                {user?.secondname || user.username} {user?.firstname && user?.firstname[0] + '.'} {user?.thirdname && user?.thirdname[0] + '.'}
                            </option>
                        ))}
                    </select>
                    {projectMembers.map(e => <div>
                        <div key={e._id}>{e?.secondname} {e?.firstname}</div>
                        <button onClick={() => removeUserByProject(e._id)}>Убрать пользователля</button>
                    </div>)}
                    <button onClick={() => createProject(projectTitle, projectMembers)}>Создать проект</button>
                </div>
            }
            <h2>Projects</h2>
            <div className='projects'>
                {projects.map(e => (
                    <div className='project' key={e._id}>
                        <div>
                            <Link to={`/project/${e._id}`}>
                                {e.title}
                            </Link>
                            <button onClick={() => deleteProject(e._id)}>Удалить проект</button>
                        </div>
                        {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                            <div className='members'>
                                <div>Участники проекта</div>
                                <div>{e.members.map(e => <div key={e._id}>{e.secondname}</div>)}</div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}