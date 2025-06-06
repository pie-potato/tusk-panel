const ApiError = require("../exeptions/apiError");
const Chat = require("../mongooseModels/Chat");
const Message = require("../mongooseModels/Message");
const Task = require("../mongooseModels/Task");

class chatService {
    async getChatByTaskId(taskId) {
        return await Chat.find({ taskId: taskId })
    }

    async createChat(taskId) {
        const task = await Task.findById(taskId)
        if (!task) throw ApiError.BadRequest()
        const chat = await Chat.create({
            taskId: taskId
        })
        const updatedTask = await Task.findByIdAndUpdate(taskId, { chatId: chat._id }, { new: true })
        return updatedTask
    }

    async deleteChat(chatId) {
        await Message.deleteMany({ chatId: chatId })
        const chat = await Chat.findByIdAndDelete(chatId)
        const task = await Task.findByIdAndUpdate(chat.taskId, { $unset: { chatId } }, { new: true })
        return { chat, task }
    }
}

module.exports = new chatService()