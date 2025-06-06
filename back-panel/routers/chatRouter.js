const { Router } = require("express")
const chatController = require("../controllers/chatController")

const chatRouter = new Router()

chatRouter.get("/:taskId", chatController.getChatById) // Получаем чат по задаче
chatRouter.post("/:projectId/:taskId", chatController.createChat) // Создаем чат по задаче
chatRouter.delete("/:projectId/:chatId", chatController.deleteChat) // Удаляем чат по задаче

module.exports = chatRouter