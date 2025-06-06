import axios from '../../configs/axiosConfig'

export const createChat = async (projectId, taskId) => {
    try {
        await axios.post(`/api/chat/${projectId}/${taskId}`)
    } catch (error) {
        console.error(error)
    }
}

export const deleteChat = async (projectId, chatId) => {
    try {
        await axios.delete(`/api/chat/${projectId}/${chatId}`)
    } catch (error) {
        console.error(error)
    }
}