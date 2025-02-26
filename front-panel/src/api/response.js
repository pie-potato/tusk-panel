import axios from "axios";

export const fetchColumns = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/columns`);
    return response
  } catch (error) {
    console.error('Error fetching columns:', error);
  }
};

export const addColumn = async (newColumnName, setNewColumnName, boardId, user, projectId) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/column/${projectId}`, { title: newColumnName, boardId: boardId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setNewColumnName('');
  } catch (error) {
    console.error('Error adding column:', error);
  }
};

export const addTask = async (newTask, setNewTask, user, projectId) => {
  if (!newTask.columnId) {
    alert('Please select a column');
    return;
  }
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/task/${projectId}`, newTask, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setNewTask({ columnId: null, title: '' });
  } catch (error) {
    console.error('Error adding task:', error);
  }
};


export const deleteColumn = async (id, projectId) => {
  try {
    await axios.delete(`http://${window.location.hostname}:5000/api/column/${id}/${projectId}`);
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};

export const deleteBoard = async (boardId, user, projectId) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.delete(`http://${window.location.hostname}:5000/api/board/${boardId}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};

export const deleteTask = async (id, projectId) => {
  try {
    await axios.delete(`http://${window.location.hostname}:5000/api/task/${id}/${projectId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const handleColumnEditSave = async (columnId, columnName, projectId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/${projectId}/columns/${columnId}`, { title: columnName });
  } catch (error) {
    console.error('Error updating column:', error);
  }
};

export const editTaskTitle = async (taskId, taskTitle, projectId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/task/${taskId}/${projectId}`, { title: taskTitle });
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const editTaskDescription = async (taskId, taskDescription, projectId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/task/description/${taskId}/${projectId}`, { description: taskDescription });
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const fetchUsers = async (setUsers) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/user`); // New route to get all users
    setUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const assignTask = async (taskId, userId, projectId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/task/${taskId}/assign/${projectId}`, { userId });
  } catch (error) {
    console.error('Error assigning task:', error);
  }
};

export const unassignTask = async (taskId, unAssignedUserId, projectId) => {
  try {
    await axios.delete(`http://${window.location.hostname}:5000/api/task/${taskId}/assign/${unAssignedUserId}/${projectId}`, { userId: unAssignedUserId }); // Send null userId to unassign
  } catch (error) {
    console.error('Error unassigning task:', error);
  }
};

export const handleCreateUser = async (newUser, setNewUser) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/user/admin`, newUser, {
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
    await axios.put(`http://${window.location.hostname}:5000/api/user/admin/role/${userId}`, { role: newRole });
  } catch (error) {
    console.log(error);

  }
};

export const handleEditNickname = async (user, name, setUser, setIsEditing) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put(`http://${window.location.hostname}:5000/api/user/profile`, name, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(name);
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating nickname:", error);
  }
};

export const fetchUserData = async (name, setUser, setNewNickname) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${window.location.hostname}:5000/api/user/profile`, { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
    setNewNickname({ ...name, firstname: response.data.firstame || '' }); // Set initial nickname
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getUsers = async (setUsers) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/user/admin`);
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

    await axios.put(`http://${window.location.hostname}:5000/api/user/admin/${editingUser._id}`, updateData);
    setEditingUser(null);
    setEditPassword('');
  } catch (error) {
    console.log(error);
  }
};

export const getBoard = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/boards`);
    return response
  } catch (error) {
    console.log(error)
  }
}

export const getBoardByProjectId = async (projectId) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/board/${projectId}`);
    return response
  } catch (error) {
    console.log(error)
  }
}

export const addBoard = async (newBoard, setNewBoard, user, projectId) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/board`, { title: newBoard, projectId: projectId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setNewBoard('')
  } catch (error) {
    console.log(error)
  }
}

export const getColumnByIdBoard = async (boardId) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/column/${boardId}`);
    return response
  } catch (error) {
    console.log(error)
  }
}

export const updateBoardNameById = async (updateColumnName, boardId) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put(`http://${window.location.hostname}:5000/api/boards/${boardId}`, { title: updateColumnName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
}

export const handleFileUpload = async (event, taskId, projectId) => {
  console.log(event);
  const file = event.target.files[0];
  if (!file) return;
  try {
    console.log(taskId);

    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`http://${window.location.hostname}:5000/api/task/${taskId}/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export const handleDeleteAttachment = async (filename, task, projectId) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.delete(`http://${window.location.hostname}:5000/api/task/${task._id}/attachments/${filename}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting attachment:', error);
  }
};

export const fetchProjects = async (setProjects) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${window.location.hostname}:5000/api/project`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProjects(response.data);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProject = async (projectId) => {
  try {
    console.log(projectId);

    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.delete(`http://${window.location.hostname}:5000/api/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    console.log(error);
  }
}

export const createProject = async (title, members = []) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/project`, { title: title, members: members }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const addTuskDate = async (projectId, taskId, startDate, endDate) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/task/${taskId}/date/${projectId}`, { startDate: startDate, endDate: endDate })
  } catch (error) {
    console.log(error)
  }
}

export const deleteMemberFromProject = async (projectId, userId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/project/${projectId}/${userId}`)
  } catch (error) {
    console.log(error)
  }
}