import axios from "axios";

export const fetchColumns = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/columns');
    return response
  } catch (error) {
    console.error('Error fetching columns:', error);
  }
};

export const addColumn = async (newColumnName, setNewColumnName, boardId, user) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post('http://localhost:5000/api/columns', { title: newColumnName, boardId: boardId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setNewColumnName('');
    fetchColumns();
  } catch (error) {
    console.error('Error adding column:', error);
  }
};

export const addTask = async (newTask, setNewTask, user) => {
  if (!newTask.columnId) {
    alert('Please select a column');
    return;
  }
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post('http://localhost:5000/api/tasks', newTask, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setNewTask({ columnId: null, title: '' });
    fetchColumns(); // Refresh columns to reflect new task
  } catch (error) {
    console.error('Error adding task:', error);
  }
};


export const deleteColumn = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/columns/${id}`);
    fetchColumns();
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchColumns(); // Refresh columns after deleting task
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const handleColumnEditSave = async (columnId, columnName) => {
  try {
    await axios.put(`http://localhost:5000/api/columns/${columnId}`, { title: columnName });
    fetchColumns();
  } catch (error) {
    console.error('Error updating column:', error);
  }
};

export const handleTaskEditSave = async (taskId, taskTitle) => {
  try {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { title: taskTitle });
    fetchColumns();
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const fetchUsers = async (setUsers) => {
  try {
    const response = await axios.get('http://localhost:5000/api/users'); // New route to get all users
    setUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const assignTask = async (taskId, userId) => {
  try {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}/assign`, { userId });
    // fetchColumns();
  } catch (error) {
    console.error('Error assigning task:', error);
  }
};

export const unassignTask = async (taskId) => {
  try {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}/assign`, { userId: null }); // Send null userId to unassign
  } catch (error) {
    console.error('Error unassigning task:', error);
  }
};

export const handleCreateUser = async (newUser, setNewUser) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.post('http://localhost:5000/api/admin/users', newUser, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      }
    });
    setNewUser({ username: '', password: '', role: 'employee' });
    alert('User created successfully!');  // Или другое уведомление об успехе
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const handleUpdateRole = async (userId, newRole) => {
  try {
    await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole });
    // ... refresh user list or update state
  } catch (error) {
    // Handle error
  }
};

export const handleEditNickname = async (user, newNickname, setUser, setIsEditing) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put('http://localhost:5000/api/profile', { nickname: newNickname }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser({ ...user, nickname: newNickname });
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating nickname:", error);
  }
};

export const fetchUserData = async (setUser, setNewNickname) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get('http://localhost:5000/api/profile', { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
    setNewNickname(response.data.nickname || ''); // Set initial nickname
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getUsers = async (setUsers) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/admin/users`);
    setUsers(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const handleUpdateUser = async (editingUser, editPassword, setEditingUser, setEditPassword) => {
  try {

    const updateData = { role: editingUser.role };

    if (editPassword) { // Only send password if it's changed
      updateData.password = editPassword;
    }

    await axios.put(`http://localhost:5000/api/admin/users/${editingUser._id}`, updateData);
    setEditingUser(null);
    setEditPassword('');
    // ... refresh user list or update state
  } catch (error) {
    console.log(error);
  }
};

export const getBoard = async (setAllBoards) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/boards`);
    setAllBoards(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const addBoard = async (newBoard, setNewBoard, user) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post(`http://localhost:5000/api/boards`, { title: newBoard }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setNewBoard('')
  } catch (error) {
    console.log(error)
  }
}

export const getColumnByIdBoard = async (setColumnById, boardId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/boards/${boardId}/columns`);
    setColumnById(response)
  } catch (error) {
    console.log(error)
  }
}

export const updateBoardNameById = async (updateColumnName, boardId) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.put(`http://localhost:5000/api/boards/${boardId}`, { title: updateColumnName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
}