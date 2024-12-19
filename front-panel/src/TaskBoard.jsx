import React, { useState, useEffect } from 'react';
import "./App.css"
import BoardDock from './BoardDock';
import { getColumnByIdBoard, getBoard } from './api/response';
import Board from './Board';
import { io } from "socket.io-client";

function TaskBoard() {
  const [activeBoard, setActiveBoard] = useState(null)
  const [allBoard, setAllBoards] = useState([])

  const getAllBoard = async () => {
    const response = await getBoard()
    setAllBoards(response.data)
  }

  useEffect(() => {
    getAllBoard()

    const socket = io(`ws://${window.location.hostname}:5000`); // Подключаемся к Socket.IO серверу
    socket.on('connect', () => { // После установки соединения
      console.log('Соединение с сервером установлено');
      socket.emit('joinBoard', '\\'); // Присоединяемся к комнате доски, используя activeBoard
    });
    socket.on('addBoard', (newBoard) => { //  Добавление колонки
      console.log(newBoard);
 
      setAllBoards(prevAllBoards => [...prevAllBoards, newBoard])
    });
    socket.on('deleteBoard', (deletedBoard) => { //  Добавление колонки
      console.log(deletedBoard);

      setAllBoards(prevAllBoards => prevAllBoards.filter(e => e._id !== deletedBoard._id))
    });
    return () => {
      socket.disconnect();
    };
  }, [])

  

  return (
    <div className="container">
      <BoardDock activeBoard={activeBoard} setActiveBoard={setActiveBoard} allBoard={allBoard} />
      <Board boardId={activeBoard} />
    </div>
  );
}

export default TaskBoard;