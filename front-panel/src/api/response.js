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
    const response = await axios.post(`http://${window.location.hostname}:5000/api/columns`, { title: newColumnName, boardId: boardId, projectId: projectId }, {
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
    await axios.post(`http://${window.location.hostname}:5000/api/tasks`, {...newTask, projectId: projectId}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setNewTask({ columnId: null, title: '' });
  } catch (error) {
    console.error('Error adding task:', error);
  }
};


export const deleteColumn = async (id) => {
  try {

    const response = await axios.delete(`http://${window.location.hostname}:5000/api/columns/${id}`);
    fetchColumns();
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};

export const deleteBoard = async (boardId, user, projectId) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.delete(`http://${window.location.hostname}:5000/api/project/${projectId}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`http://${window.location.hostname}:5000/api/tasks/${id}`);
    fetchColumns(); // Refresh columns after deleting task
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const handleColumnEditSave = async (columnId, columnName) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/columns/${columnId}`, { title: columnName });
    fetchColumns();
  } catch (error) {
    console.error('Error updating column:', error);
  }
};

export const editTaskTitle = async (taskId, taskTitle) => {
  try {
    const response = await axios.put(`http://${window.location.hostname}:5000/api/tasks/${taskId}`, { title: taskTitle });
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const editTaskDescription = async (taskId, taskDescription) => {
  try {
    const response = await axios.put(`http://${window.location.hostname}:5000/api/tasks/${taskId}/description`, { description: taskDescription });
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const fetchUsers = async (setUsers) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}:5000/api/users`); // New route to get all users
    setUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const assignTask = async (taskId, userId) => {
  try {
    await axios.put(`http://${window.location.hostname}:5000/api/tasks/${taskId}/assign`, { userId });
  } catch (error) {
    console.error('Error assigning task:', error);
  }
};

export const unassignTask = async (taskId, unAssignedUserId) => {
  try {
    await axios.delete(`http://${window.location.hostname}:5000/api/tasks/${taskId}/assign/${unAssignedUserId}`, { userId: unAssignedUserId }); // Send null userId to unassign
  } catch (error) {
    console.error('Error unassigning task:', error);
  }
};

export const handleCreateUser = async (newUser, setNewUser) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/admin/users`, newUser, {
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
    await axios.put(`http://${window.location.hostname}:5000/api/admin/users/${userId}/role`, { role: newRole });
    // ... refresh user list or update state
  } catch (error) {
    // Handle error
  }
};

export const handleEditNickname = async (user, name, setUser, setIsEditing) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put(`http://${window.location.hostname}:5000/api/profile`, name, {
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
    const response = await axios.get(`http://${window.location.hostname}:5000/api/profile`, { // New route for profile data
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
    const response = await axios.get(`http://${window.location.hostname}:5000/api/admin/users`);
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

    await axios.put(`http://${window.location.hostname}:5000/api/admin/users/${editingUser._id}`, updateData);
    setEditingUser(null);
    setEditPassword('');
    // ... refresh user list or update state
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
    const response = await axios.get(`http://${window.location.hostname}:5000/api/projects/${projectId}/boards`);
    return response
  } catch (error) {
    console.log(error)
  }
}

export const addBoard = async (newBoard, setNewBoard, user, projectId) => {
  try {
    const token = user ? JSON.parse(user).token : null;
    await axios.post(`http://${window.location.hostname}:5000/api/boards`, { title: newBoard, projectId: projectId }, {
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
    const response = await axios.get(`http://${window.location.hostname}:5000/api/boards/${boardId}/columns`);
    return response
  } catch (error) {
    console.log(error)
  }
}

export const updateBoardNameById = async (updateColumnName, boardId) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.put(`http://${window.location.hostname}:5000/api/boards/${boardId}`, { title: updateColumnName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
}

export const handleFileUpload = async (event, task) => {
  console.log(event);

  const file = event.target.files[0];
  if (!file) return;


  try {

    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

    const formData = new FormData();
    formData.append('file', file);


    const response = await axios.post(`http://${window.location.hostname}:5000/api/tasks/${task._id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    // ... update task state with the new attachment

  } catch (error) {
    console.error('Error uploading file:', error);
    // ... handle error (e.g., display an error message)
  }
};

export const handleDeleteAttachment = async (filename, task) => {
  try {

    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;


    await axios.delete(`http://${window.location.hostname}:5000/api/tasks/${task._id}/attachments/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }

    });
    // Update the task state to remove the deleted attachment from the attachments array
    // For example:
    // setTask(prevTask => ({
    //     ...prevTask,
    //     attachments: prevTask.attachments.filter(attachment => attachment.filename !== filename)
    // }));

  } catch (error) {

    console.error('Error deleting attachment:', error);


  }
};

export const fetchProjects = async (setProjects) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${window.location.hostname}:5000/api/projects`);
    setProjects(response.data);
  } catch (error) {
    console.log(error);
  }
};