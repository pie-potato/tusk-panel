const chatService = require("../services/chatService")
const { emitEventToRoom } = require("../socket/socketService")

class chatController {
    async getChatById(req, res, next) {
        try {
            const chat = await chatService.getChatByTaskId(req.params.taskId)
            res.json(chat)
        } catch (error) {
            next(error)
        }
    }

    async createChat(req, res, next) {
        try {
            const chat = await chatService.createChat(req.params.taskId)
            emitEventToRoom(req.params.projectId, 'updateTask', chat)
            res.json(chat)
        } catch (error) {
            next(error)
        }
    }

    async deleteChat(req, res, next) {
        try {
            const chat = await chatService.deleteChat(req.params.chatId)
            emitEventToRoom(req.params.chatId, 'deleteChat', chat.chat)
            emitEventToRoom(req.params.projectId, 'updateTask', chat.task)
            res.json(chat)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new chatController()