import axios from "axios";

export const addTask = async (newTask, setNewTask, user, projectId) => {
    if (!newTask.columnId) {
        alert('Please select a column');
        return;
    }
    try {
        const token = user ? JSON.parse(user).token : null;
        await axios.post(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${projectId}`, newTask, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setNewTask({ columnId: null, title: '' });
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

export const addTuskDate = async (projectId, taskId, startDate, endDate) => {
    try {
        console.log(startDate, endDate)
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${taskId}/date/${projectId}`, { startDate: startDate, endDate: endDate }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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
        console.log(event.target.files)
        await axios.post(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${taskId}/upload/${projectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export const unassignTask = async (taskId, unAssignedUserId, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.delete(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${taskId}/assign/${unAssignedUserId}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.error('Error unassigning task:', error);
    }
};

export const assignTask = async (taskId, userId, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${taskId}/assign/${projectId}`, { userId }, {
            headers: {
                Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            }
        });
    } catch (error) {
        console.error('Error assigning task:', error);
    }
};

export const editTaskDescription = async (taskId, taskDescription, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/description/${taskId}/${projectId}`, { description: taskDescription }, {
            headers: {
                Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            }
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

export const editTaskTitle = async (taskId, taskTitle, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${taskId}/${projectId}`, { title: taskTitle }, {
            headers: {
                Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            }
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

export const deleteTask = async (id, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.delete(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${id}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

export const handleDeleteAttachment = async (filename, task, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.delete(`http://${process.env.PUBLIC_BACKEND_URL}/api/task/${task._id}/attachments/${filename}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error deleting attachment:', error);
    }
};