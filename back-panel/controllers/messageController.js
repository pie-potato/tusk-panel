const Message = require("../mongooseModels/Message")
const messageService = require("../services/messageService")
const { emitEventToRoom } = require("../socket/socketService")

class messageController {
    async getMessageByChatid(req, res, next) {
        try {
            const messages = await messageService.getMessageByChatId(req.params.chatId)
            res.json(messages)
        } catch (error) {
            next(error)
        }
    }

    async sendMessage(req, res, next) {
        try {
            const message = await messageService.sendMessage(req.params.chatId, req.userId, req.body.content, req.body.attachments)
            emitEventToRoom(req.params.chatId, 'sendMessage', message)
            res.json(message)
        } catch (error) {
            next(error)
        }
    }

    async markAsRead(req, res, next) {
        try {
            await messageService.markAsRead(req.params.messageId, req.userId)
            res.status(200)
        } catch (error) {
            next(error)
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const message = await messageService.deleteMessage(req.params.messageId)
            res.status(200).json(message)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new messageController()