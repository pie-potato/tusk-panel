import axios from "../../configs/axiosConfig";

export const addTask = async (newTask, projectId) => {
    try {
        return await axios.post(`/api/task/${projectId}`, newTask)
    } catch (error) {
        console.error(error);
    }
}

export const addTuskDate = async (projectId, taskId, startDate, endDate) => {
    try {
        return await axios.put(`/api/task/${taskId}/date/${projectId}`, { startDate: startDate, endDate: endDate })
    } catch (error) {
        console.error(error);
    }
}

export const uploadFile = async (file, taskId, projectId) => {
    try {
        await axios.post(`/api/task/${taskId}/upload/${projectId}`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export const unassignTask = async (taskId, unAssignedUserId, projectId) => {
    try {
        return await axios.delete(`/api/task/${taskId}/assign/${unAssignedUserId}/${projectId}`)
    } catch (error) {
        console.error(error);
    }
}

export const assignTask = async (taskId, userId, projectId) => {
    try {
        return await axios.put(`/api/task/${taskId}/assign/${projectId}`, { userId })
    } catch (error) {
        console.error(error);
    }
}

export const editTaskDescription = async (taskId, taskDescription, projectId) => {
    try {
        return await axios.put(`/api/task/description/${taskId}/${projectId}`, { description: taskDescription })
    } catch (error) {
        console.error(error);
    }
};

export const editTaskTitle = async (taskId, taskTitle, projectId) => {
    try {
        return await axios.put(`/api/task/${taskId}/${projectId}`, { title: taskTitle })
    } catch (error) {
        console.error(error);
    }
};

export const deleteTask = async (id, projectId) => {
    try {
        return await axios.delete(`/api/task/${id}/${projectId}`)
    } catch (error) {
        console.error(error);
    }
};

export const handleDeleteAttachment = async (filename, task, projectId) => {
    try {
        return await axios.delete(`/api/task/${task._id}/attachments/${filename}/${projectId}`);
    } catch (error) {
        console.error(error);
    }
};