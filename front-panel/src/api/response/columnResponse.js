import axios from '../../configs/axiosConfig'

export const getColumnByIdBoard = async (boardId) => {
    try {
        return await axios.get(`/api/column/${boardId}`)
    } catch (error) {
        console.error(error);
    }
}

export const addColumn = async (newColumnName, boardId, projectId) => {
    try {
        return await axios.post(`/api/column/${boardId}/${projectId}`, { title: newColumnName })
    } catch (error) {
        console.error(error);
    }
}

export const editColumn = async (columnId, columnName, projectId) => {
    try {
        return await axios.put(`/api/column/${columnId}/${projectId}`, { title: columnName })
    } catch (error) {
        console.error(error);
    }
}

export const deleteColumn = async (id, projectId) => {
    try {
        return await axios.delete(`/api/column/${id}/${projectId}`)
    } catch (error) {
        console.error(error);
    }
}