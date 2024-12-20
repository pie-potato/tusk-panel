import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [projectTitle, setProjectTitle] = useState([]);
console.log(projects);

    const createProject = async (title, members = []) => {
        await axios.post(`http://${window.location.hostname}:5000/api/projects`, {title: title, members: members})
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
                const response = await axios.get(`http://${window.location.hostname}:5000/api/projects`);
                setProjects(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProjects();
    }, []);
    // ... functions to create/edit projects (similar to boards/columns/tasks)
    return (
        <div>
            <div>
                <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)}/>
                <button onClick={() => createProject(projectTitle)}>asd</button>
            </div>
            <h2>Projects</h2>
           {projects.map(e => <div>{e.title}</div> )}
        </div>
    );
}