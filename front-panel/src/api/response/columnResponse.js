import axios from "axios";

export const getColumnByIdBoard = async (boardId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const response = await axios.get(`http://${window.location.hostname}/api/column/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response
    } catch (error) {
        console.log(error)
    }
}

export const addColumn = async (newColumnName, setNewColumnName, boardId, user, projectId) => {
    try {
        const token = user ? JSON.parse(user).token : null;
        await axios.post(`http://${window.location.hostname}/api/column/${boardId}/${projectId}`, { title: newColumnName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setNewColumnName('');
    } catch (error) {
        console.error('Error adding column:', error);
    }
};

export const handleColumnEditSave = async (columnId, columnName, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${window.location.hostname}/api/column/${columnId}/${projectId}`, { title: columnName }, {
            headers: {
                Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            }
        });
    } catch (error) {
        console.error('Error updating column:', error);
    }
};

export const deleteColumn = async (id, projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.delete(`http://${window.location.hostname}/api/column/${id}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        console.error('Error deleting column:', error);
    }
};