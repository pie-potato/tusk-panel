import React, { useState, useRef } from "react";
import { deleteBoard } from "./api/response/boardResponse.js";
import ContextMenu from "./UI/ContextMenu/ContextMenu";

export default function BoardDockElement({ boardInfo, activeBoard, setActiveBoard, projectId }) {

    const [isMouse, setIsMouse] = useState(false)
    const contextBoardMenuRef = useRef()

    return (
        <div className={activeBoard === boardInfo._id ? 'board_dock_element active' : 'board_dock_element'}>
            <div onClick={() => setActiveBoard(boardInfo._id)}>{boardInfo.title}</div>
            <div onClick={() => { setIsMouse(true) }} className="board_delete_button" ref={contextBoardMenuRef}>...</div>
            {isMouse && <ContextMenu onMouseLeave={() => setIsMouse(false)} refelement={contextBoardMenuRef} corectx={-5} corecty={20}>
                <button onClick={async () => await deleteBoard(boardInfo._id, localStorage.getItem('user'), projectId)} className="delete_task">Удалить доску</button>
                <button onClick={() => { }} className="delete_task">Редактировать задачу</button>
            </ContextMenu>}
        </div>
    )
}