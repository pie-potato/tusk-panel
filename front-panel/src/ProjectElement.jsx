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
                    <div>{project.members.map(e => <div className="project_element_member" key={e._id}>{e.secondname} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" type="ui"><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg></div>)}</div>
                </div>
            }
        </div>
    )
}