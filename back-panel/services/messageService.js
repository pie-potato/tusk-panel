const Message = require("../mongooseModels/Message");

class messageService {
    async getMessageByChatId(chatId, page = 1, limit = 50) {
        return await Message.find({ chatId: chatId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'sender',
                select: '-_id -__v -password -mail -role'
            })
    }

    async sendMessage(chatId, sender, content = '', attachments = []) {
        const message = await Message.create({ chatId: chatId, sender: sender, content: content, attachments: attachments })
        return await message.populate({
            path: 'sender',
            select: '-_id -__v -password -mail -role'
        })
    }

    async markAsRead(messageIds, userId) {
        return await Message.updateMany(
            { _id: { $in: messageIds } },
            { $addToSet: { readBy: userId } }
        )
    }

    async deleteMessage(messageId) {
        return await Message.findByIdAndDelete(messageId)
    }
}

module.exports = new messageService()