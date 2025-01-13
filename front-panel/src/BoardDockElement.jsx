import React, { useState, useRef } from "react";
import { deleteBoard } from "./api/response";

export default function BoardDockElement({ boardInfo, activeBoard, setActiveBoard, projectId }) {

    const [isMouse, setIsMouse] = useState(false)
    const contextBoardMenuRef = useRef()

    return (
        <div className={activeBoard === boardInfo._id ? 'board_dock_element active' : 'board_dock_element'}>
            <div onClick={() => setActiveBoard(boardInfo._id)}>{boardInfo.title}</div>
            <div onClick={() => { setIsMouse(true) }} className="board_delete_button" ref={contextBoardMenuRef}>...</div>
            {isMouse && <div onMouseLeave={() => {
                setIsMouse(false)
            }} className="context_menu" style={{ transform: `translate(${contextBoardMenuRef.current.getBoundingClientRect().left - 5}px, ${contextBoardMenuRef.current.getBoundingClientRect().top + 20}px)` }}>
                <button onClick={async () => await deleteBoard(boardInfo._id, localStorage.getItem('user'), projectId)} className="delete_task">Удалить доску</button>
                <button onClick={() => { }} className="delete_task">Редактировать задачу</button>
            </div>
            }
        </div>
    )
}