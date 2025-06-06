const { Router } = require('express')
const messageController = require('../controllers/messageController')
const decodedUserId = require('../middleware/decodedUserId')

const messageRouter = new Router()

messageRouter.get("/:chatId", messageController.getMessageByChatid) // Получаем все сообщения чата по задаче
messageRouter.post("/:chatId", decodedUserId, messageController.sendMessage) // Отправляем сообщение в чат
messageRouter.delete("/:messageId", messageController.deleteMessage) // Удаляем сообщение
// messageRouter.patch("/:messageId/mark-as-read") // Помечаем сообщение как прочитаное

module.exports = messageRouter