import { useState, useRef } from "react";
import { deleteBoard } from "../api/response/boardResponse.js";
import ContextMenu from "../UI/ContextMenu/ContextMenu.jsx";
import Button from "../UI/Button/Button.jsx";

export default function BoardDockElement({ boardInfo, activeBoard, setActiveBoard, projectId }) {

    const [isMouse, setIsMouse] = useState(false)
    const contextBoardMenuRef = useRef()

    return (
        <div className={activeBoard === boardInfo._id ? 'board_dock_element active' : 'board_dock_element'}>
            <div onClick={() => setActiveBoard(boardInfo._id)}>{boardInfo.title}</div>
            <ContextMenu >
                <Button onClick={async () => await deleteBoard(boardInfo._id, localStorage.getItem('user'), projectId)} className="delete_task">Удалить доску</Button>
                <Button onClick={() => { }} className="delete_task">Редактировать задачу</Button>
            </ContextMenu>
        </div>
    )
}