import { useState } from "react";
import { addBoard } from '../api/response/boardResponse';
import '../../styles/BoardDock.css'
import BoardDockElement from "./BoardDockElement";
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
            {allBoard.map(e => <BoardDockElement key={e._id} boardInfo={e} activeBoard={activeBoard} setActiveBoard={setActiveBoard} projectId={projectId} />)}
            <div onClick={() => setCreateBoard(true)}>
                {creaeteBoard
                    ? <input
                        className="board_dock_add_input"
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
                    : <button className="board_dosk_add_button">+</button>
                }
            </div>

        </div>
    )
}