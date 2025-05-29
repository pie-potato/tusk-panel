import axios from "axios";

export const getBoardByProjectId = async (projectId) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await axios.get(`${process.env.PUBLIC_BACKEND_URL}/api/board/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response
    } catch (error) {
      console.log(error)
    }
  }

export const addBoard = async (newBoard, setNewBoard, user, projectId) => {
    try {
      const token = user ? JSON.parse(user).token : null;
      await axios.post(`${process.env.PUBLIC_BACKEND_URL}/api/board/${projectId}`, { title: newBoard }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewBoard('')
    } catch (error) {
      console.log(error)
    }
  }

export const updateBoardNameById = async (updateColumnName, boardId) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      await axios.put(`${process.env.PUBLIC_BACKEND_URL}/api/boards/${boardId}`, { title: updateColumnName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error)
    }
  }

export const deleteBoard = async (boardId, user, projectId) => {
    try {
      const token = user ? JSON.parse(user).token : null;
      await axios.delete(`${process.env.PUBLIC_BACKEND_URL}/api/board/${boardId}/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };