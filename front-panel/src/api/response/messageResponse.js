import axios from '../../configs/axiosConfig'

export const sendMessage = async (chatId, newMessage) => {
    try {
        await axios.post(`/api/message/${chatId}`, { content: newMessage })
    } catch (error) {
        console.error(error)
    }
}

export const deleteMessage = async (chatId) => {
    try {
        await axios.delete(`/api/message/${chatId}`)
    } catch (error) {
        console.error(error)
    }
}