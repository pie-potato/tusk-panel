import React, { useState, useEffect } from "react";
import { getBoard, addBoard, deleteBoard } from './api/response';
import './BoardDock.css'
import { useParams } from "react-router-dom";

export default function BoardDock({ activeBoard, setActiveBoard, allBoard }) {

    const [creaeteBoard, setCreateBoard] = useState(false)
    const [newColumnName, setNewColumnName] = useState('');
    const { projectId } = useParams()

    const createBoard = () => {
        addBoard(newColumnName, setNewColumnName, localStorage.getItem('user'), projectId)
        setNewColumnName('')
        setCreateBoard(false)
    }

    return (
        <div className="board_dock">
            {allBoard.map(e => <div key={e._id} className={activeBoard === e._id ? 'board_dock_element active' : 'board_dock_element'}>
                <div onClick={() => setActiveBoard(e._id)}>{e.title}</div>
                <button onClick={async () => {
                    await deleteBoard(e._id, localStorage.getItem('user'), projectId)
                }} className="board_delete_button">...</button>
            </div>)}
            <div onClick={() => setCreateBoard(true)}>
                {creaeteBoard
                    ? <input
                        type="text"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                createBoard()
                            }
                        }}
                        onBlur={() => {
                            setNewColumnName('')
                            setCreateBoard(false)
                        }}
                    />
                    : <button>+</button>
                }
            </div>

        </div>
    )
}