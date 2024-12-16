import React, { useState, useEffect } from "react";
import { getBoard, addBoard, deleteBoard } from './api/response';
import './BoardDock.css'
import { io } from "socket.io-client";

export default function BoardDock({ activeBoard, setActiveBoard }) {

    const [allBoard, setAllBoards] = useState([])
    const [creaeteBoard, setCreateBoard] = useState(false)
    const [newColumnName, setNewColumnName] = useState('');

    const getAllBoard = async () => {
        const response = await getBoard()
        setAllBoards(response.data)
        setActiveBoard(allBoard[0]?._id)
    }

    useEffect(() => {
        getAllBoard()
    }, [])

    const createBoard = () => {
        addBoard(newColumnName, setNewColumnName, localStorage.getItem('user'))
        setNewColumnName('')
        setCreateBoard(false)
        getBoard(setAllBoards)
    }

    return (
        <div className="board_dock">
            {allBoard.map(e => <div key={e._id} className={activeBoard === e._id ? 'board_dock_element active' : 'board_dock_element'} onClick={() => setActiveBoard(e._id)}>
                {e.title}
                <button onClick={async() => {
                    await deleteBoard(e._id, localStorage.getItem('user'))
                    getBoard(setAllBoards)
                }} className="context_menu_button">...</button>
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
                                getBoard(setAllBoards)
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