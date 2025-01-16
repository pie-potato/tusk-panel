import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { deleteProject, deleteMemberFromProject } from "./api/response";
import './ProjectElement.css'
import ContextMenu from "./UI/ContextMenu/ContextMenu";

export default function ProjectElement({ project }) {

    const contextProjectElemntMenu = useRef()
    const [isMouse, setIsMouse] = useState(false)

    return (
        <div className='project' key={project._id}>
            <div className="link_and_context_menu">
                <Link className="link_to_project" to={`/project/${project._id}`}>
                    {project.title}
                </Link>
                {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                    <>
                        <div className="trash" onClick={() => setIsMouse(true)} ref={contextProjectElemntMenu}>...</div>
                        {isMouse && <ContextMenu
                            onMouseLeave={() => setIsMouse(false)}
                            refelement={contextProjectElemntMenu}
                            corectx={0}
                            corecty={20}
                        >
                            <button className="delete_project" onClick={() => deleteProject(project._id)}>Удалить проект</button>
                        </ContextMenu>}
                    </>
                }
            </div>
            {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                <div className='members'>
                    <div>Участники проекта</div>
                    <div>{project.members.map(e =>
                        <div className="project_element_member" key={e._id}>
                            {e.secondname}
                            <img onClick={() => deleteMemberFromProject(project._id, e._id)} className="trash" src="./media/trash.svg" alt="Мусорка" />
                        </div>)}
                    </div>
                </div>
            }
        </div>
    )
}