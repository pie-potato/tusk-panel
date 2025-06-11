import { useMemo, useState } from "react";
import { deleteBoard, updateBoardNameById } from "../api/response/boardResponse.js";
import ContextMenu from "../UI/ContextMenu/ContextMenu.jsx";
import Button from "../UI/Button/Button.jsx";
import { useModal } from "../contexts/ModalContext.jsx";
import Input from "../UI/Input/Input.jsx";

export default function BoardDockElement({ boardInfo, activeBoard, setActiveBoard, projectId }) {

    const [changeBoard, setChangeBoard] = useState(false)
    const [boardTitle, setBoardTitle] = useState('')

    const { confirmOpen } = useModal()

    const deletedBoard = () => deleteBoard(boardInfo._id, projectId)

    const boardClass = useMemo(() => {
        let className = "board_dock_element"
        if (activeBoard === boardInfo?._id) {
            className += " active"
        }
        if (changeBoard) {
            className += " changed"
        }
        return className
    }, [activeBoard, changeBoard])

    return (
        <div className={boardClass}>
            {changeBoard
                ?
                <>
                    <Input
                        value={boardTitle}
                        onChange={e => setBoardTitle(e.target.value)}
                        className="board_input"
                    />
                    <ContextMenu >
                        <Button onClick={() => {
                            updateBoardNameById(boardTitle, boardInfo._id, projectId)
                            setChangeBoard(false)
                        }}>
                            Сохранить
                        </Button>
                        <Button onClick={() => {
                            setChangeBoard(false)
                        }}>
                            Отменить
                        </Button>
                    </ContextMenu>
                </>

                :
                <>
                    <div onClick={() => setActiveBoard(boardInfo._id)}>
                        {boardInfo?.title}
                    </div>
                    {(JSON.parse(localStorage.getItem('user'))?.role === "admin" || JSON.parse(localStorage.getItem('user'))?.role === "manager") &&
                        <ContextMenu >
                            <Button onClick={() => confirmOpen(deletedBoard)}>Удалить доску</Button>
                            <Button onClick={() => {
                                setBoardTitle(boardInfo.title)
                                setChangeBoard(true)
                            }}>
                                Редактировать доску
                            </Button>
                        </ContextMenu>
                    }
                </>
            }
        </div>
    )
}