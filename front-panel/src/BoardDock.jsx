import React, { useState, useEffect } from "react";
import { getBoard, addBoard } from './api/response';
import './BoardDock.css'

export default function BoardDock({ activeBoard, setActiveBoard }) {

    const [allBoard, setAllBoards] = useState([])
    const [creaeteBoard, setCreateBoard] = useState(false)
    const [newColumnName, setNewColumnName] = useState('');
    const [isBoardNameUpdate, setIsBoardNameUpdate] = useState(false)

    useEffect(() => {
        getBoard(setAllBoards)
    }, [])
    
    const createBoard = () => {
        addBoard(newColumnName, setNewColumnName, localStorage.getItem('user'))
        setNewColumnName('')
        setCreateBoard(false)
        getBoard(setAllBoards)
    }

    const updateBoardName = () => {

    }

    return (
        <div className="board_dock">
            {allBoard.map(e => <div key={e._id} className={activeBoard === e._id ? 'board_dock_element active' : 'board_dock_element'} onClick={() => setActiveBoard(e._id)}>{e.title}</div>)}
            <div onClick={() => setCreateBoard(true)}>
                {creaeteBoard
                    ? <input
                        type="text"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                        onKeyDown={event => { if (event.key === "Enter") createBoard() }}
                        onBlur={() => {
                            setNewColumnName('')
                            setCreateBoard(false)
                        }}
                    />
                    : <>+</>
                }
            </div>
        </div>
    )
}