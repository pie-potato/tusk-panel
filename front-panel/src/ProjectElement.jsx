import React from "react";
import { Link } from "react-router-dom";
import { deleteProject } from "./api/response";

export default function ProjectElement({ project }) {
    return (
        <div className='project' key={project._id}>
            <div>
                <Link to={`/project/${project._id}`}>
                    {project.title}
                </Link>
                <button onClick={() => deleteProject(project._id)}>Удалить проект</button>
            </div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <div className='members'>
                    <div>Участники проекта</div>
                    <div>{project.members.map(e => <div key={e._id}>{e.secondname}</div>)}</div>
                </div>
            }
        </div>
    )
}