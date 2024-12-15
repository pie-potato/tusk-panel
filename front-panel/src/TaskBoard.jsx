import React, { useState, useEffect} from 'react';
import "./App.css"
import BoardDock from './BoardDock';
import Board from './Board';

function TaskBoard() {
  const [activeBoard, setActiveBoard] = useState(null)
  

  return (
    <div className="container">
      <BoardDock activeBoard={activeBoard} setActiveBoard={setActiveBoard} />
      <Board boardId={activeBoard} />
    </div>
  );
}

export default TaskBoard;