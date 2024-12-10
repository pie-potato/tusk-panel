import React, { useState, useEffect } from 'react';
import "./App.css"
import Column from './Column';
import { fetchColumns, addColumn, getBoard, addBoard, getColumnByIdBoard } from './api/response';
import BoardDock from './BoardDock';

function TaskBoard() {
  const [columns, setColumns] = useState([]);
  const [columnById, setColumnById] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [allBoard, setAllBoards] = useState([])
  const [newBoard, setNewBoard] = useState('')
  const [activeBoard, setActiveBoard] = useState(null)

  async function getAllName() {
    const response = await fetchColumns()
    setColumns(response.data)
  }

  useEffect(() => {
    getAllName()
    getBoard(setAllBoards)
    // console.log(allBoard);
    setActiveBoard(allBoard[0]?._id)
  }, []);

  useEffect(() => {
    if (!activeBoard) {
      return;
    }
    getColumnByIdBoard(setColumnById, activeBoard)  
    // console.log(columnById.data);
  }, [activeBoard, columnById])

  // console.log(columnById.data);
  

  return (
    <div className="container">
      <BoardDock activeBoard={activeBoard} setActiveBoard={setActiveBoard} />
      <div >
        {allBoard.length
          ? <div className="board_columns">
            {columnById.data?.map((column) => (
              <Column key={column._id} column={column} />
            ))}
            <div className='input'>
              <div>
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Добавить колонку..."
                  onKeyDown={event => { if (event.key === "Enter") addColumn(newColumnName, setNewColumnName, activeBoard, localStorage.getItem('user')) }}
                />
                <button onClick={() => addColumn(newColumnName, setNewColumnName, activeBoard, localStorage.getItem('user'))}>Добавить колонку</button>
              </div>
            </div>
          </div>
          : <>
            <input
              type="text"
              value={newBoard}
              onChange={(e) => setNewBoard(e.target.value)}
              placeholder="Создать доску..."
              onKeyDown={event => { if (event.key === "Enter") addBoard(newBoard, setNewBoard, localStorage.getItem('user')) }}
            />
          </>
        }
      </div>
    </div>
  );
}

export default TaskBoard;