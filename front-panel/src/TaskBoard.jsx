import React, { useState, useEffect } from 'react';
import "./App.css"
import BoardDock from './BoardDock';
import { getBoardByProjectId } from './api/response';
import Board from './Board';
import { useSocket } from './WebSocketContext';
import { useParams } from 'react-router-dom';

function TaskBoard() {
  const [activeBoard, setActiveBoard] = useState(null)
  const [allBoard, setAllBoards] = useState([])
  const { socket, isConnected, joinRoom, leaveRoom } = useSocket();
  const { projectId } = useParams();

  useEffect(() => {
    if (isConnected && projectId) {
      joinRoom(projectId);
    }
    return () => {
      if (projectId) {
        leaveRoom(projectId);
      }
    }
  }, [isConnected, projectId, joinRoom, leaveRoom]);

  const getAllBoard = async (projectId) => {
    const response = await getBoardByProjectId(projectId)
    setAllBoards(response.data)
  }

  useEffect(() => {
    if (!socket) return;
    socket.on('addBoard', (newBoard) => {
      setAllBoards(prevAllBoards => [...prevAllBoards, newBoard])
    });
    socket.on('deleteBoard', (deletedBoard) => {
      setAllBoards(prevAllBoards => prevAllBoards.filter(e => e._id !== deletedBoard._id))
    });
    return () => {
      socket.off();
    };
  }, [socket])

  useEffect(() => {
    getAllBoard(projectId)
    // setActiveBoard(allBoard?.[0])
  }, [])

  return (
    <div className="container">
      <BoardDock activeBoard={activeBoard} setActiveBoard={setActiveBoard} allBoard={allBoard} />
      <Board boardId={activeBoard} />
    </div>
  );
}
export default TaskBoard;