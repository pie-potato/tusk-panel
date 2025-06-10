import axios from '../../configs/axiosConfig'

export const getBoardByProjectId = async (projectId) => {
    try {
        return await axios.get(`/api/board/${projectId}`)
    } catch (error) {
        console.error(error)
    }
}

export const addBoard = async (newBoard, projectId) => {
    try {
        return await axios.post(`/api/board/${projectId}`, { title: newBoard })
    } catch (error) {
        console.error(error)

    }
}

export const updateBoardNameById = async (updateColumnName, boardId, projectId) => {
    try {
        return await axios.put(`/api/board/${boardId}/${projectId}`, { title: updateColumnName })
    } catch (error) {
        console.error(error)

    }
}

export const deleteBoard = async (boardId, projectId) => {
    try {
        return await axios.delete(`/api/board/${boardId}/${projectId}`)
    } catch (error) {
        console.error(error)
    }
}
