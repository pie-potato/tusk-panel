import React, { useState, useEffect } from 'react';
import "./App.css"
import BoardDock from './BoardDock';
import { getColumnByIdBoard, getBoard } from './api/response';
import Board from './Board';
import { io } from "socket.io-client";

function TaskBoard() {
  const [columns, setColumns] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null)
  const [allBoard, setAllBoards] = useState([])

  console.log(JSON.parse(localStorage.getItem('user')));

  const getAllBoard = async () => {
    const response = await getBoard()
    setAllBoards(response.data)
  }

  const responseColumnById = async (boardId) => {
    const response = await getColumnByIdBoard(boardId)
    setColumns(response.data)
  }

  useEffect(() => {
    getAllBoard()
  }, [])

  useEffect(() => {
    if (!activeBoard) return;
    responseColumnById(activeBoard)
    

    const socket = io(`http://${window.location.hostname}:5000`); // Подключаемся к Socket.IO серверу
    socket.on('connect', () => { // После установки соединения
      console.log('Соединение с сервером установлено');
      socket.emit('joinBoard', activeBoard); // Присоединяемся к комнате доски, используя activeBoard
    });
    socket.on('addColumn', (newColumn) => { //  Добавление колонки
      setColumns(prevColumns => [...prevColumns, newColumn])
    });
    socket.on('updateColumn', (updatedColumn) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === updatedColumn._id) {
          return { ...e, title: updatedColumn.title }
        }
        return e
      }))
    });
    socket.on('deleteColumn', (deletedColumnId) => {
      setColumns(prevColumns => prevColumns.filter(column => column._id !== deletedColumnId));
    });
    socket.on('addTask', (newTask) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === newTask.columnId) {
          return { ...e, tasks: [...e.tasks, newTask] }
        }
        return e
      }))
    });
    socket.on('updateTask', (updatedTask) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === updatedTask.columnId) {
          return {
            ...e, tasks: e.tasks.map(e => {
              if (e._id === updatedTask._id) {
                return { ...e, title: updatedTask.title }
              }
              return e
            })
          }
        }
        return e
      }))
    });
    socket.on('deleteTask', (deletedtask) => { //  Добавление колонки
      console.log(deletedtask);

      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === deletedtask.columnId) {
          return { ...e, tasks: e.tasks.filter(e => e._id !== deletedtask._id) }
        }
        return e
      }))
    });
    socket.on('addTaskAssing', (updatedTask) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === updatedTask.columnId) {
          return {
            ...e, tasks: e.tasks.map(e => {
              if (e._id === updatedTask.taskId) {
                return { ...e, assignedTo: updatedTask.assignedTo }
              }
              return e
            })
          }
        }
        return e
      }))
    });
    socket.on('deleteTaskAssing', (updatedTask) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === updatedTask.columnId) {
          return {
            ...e, tasks: e.tasks.map(e => {
              if (e._id === updatedTask._id) {
                return updatedTask
              }
              return e
            })
          }
        }
        return e
      }))
    });
    socket.on('addAttachmentsFile', (fileData) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === fileData.columnId) {
          return {
            ...e, tasks: e.tasks.map(e => {
              if (e._id === fileData.taskId) {
                return { ...e, attachments: [...e.attachments, fileData.nameFile] }
              }
              return e
            })
          }
        }
        return e
      }))
    });
    socket.on('deleteAttachmentsFile', (fileData) => { //  Добавление колонки
      setColumns(prevColumns => prevColumns.map(e => {
        if (e._id === fileData.columnId) {
          return {
            ...e, tasks: e.tasks.map(e => {
              if (e._id === fileData.taskId) {
                return { ...e, attachments: e.attachments.filter(e => e.filename !== fileData.removedAttachment.filename) }
              }
              return e
            })
          }
        }
        return e
      }))
    });
    socket.on('addBoard', (newBoard) => { //  Добавление колонки
      console.log(newBoard);
      
      setAllBoards(prevAllBoards => [...prevAllBoards, newBoard])
      });
    return () => {
      socket.disconnect();
    };

  }, [activeBoard]);

  return (
    <div className="container">
      <BoardDock activeBoard={activeBoard} setActiveBoard={setActiveBoard} allBoard={allBoard}/>
      <Board boardId={activeBoard} columns={columns} />
    </div>
  );
}

export default TaskBoard;