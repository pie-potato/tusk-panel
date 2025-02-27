const ApiError = require("../exeptions/apiError");
const { filePath } = require("../fileStorage");
const Board = require("../mongooseModels/Board");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const fs = require("fs")

class columnService {
    async getAllColumns(boardId) {
        return await Column.find({ boardId: boardId })
            .populate({
                path: 'tasks',
                populate: {
                    path: 'createdBy assignedTo' // Populate both createdBy and assignedTo
                }
            })
    }

    async createColumn(userId, boardId, boardTitle) {
        const board = await Board.findById(boardId)
        if (!board) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role === "admin" || user.role === "manager") {
            const savedColumn = await new Column({ title: boardTitle, boardId: boardId }).save()
            return await Column.findById(savedColumn._id)
                .populate('tasks')
        }

        throw ApiError.AccessDenied()
    }

    async changeColumn(userId, columnId, newColumnTitle) {
        const column = await Column.findById(columnId)
        if (!column) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role === "admin" || user.role === "manager") {
            return await Column.findByIdAndUpdate(columnId, { title: newColumnTitle }, { new: true })
        }

        throw ApiError.AccessDenied()
    }

    async deleteColumn(userId, columnId) {
        const column = await Column.findById(columnId)
        if (!column) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role === "admin" || user.role === "manager") {
            const allTaskFromColumn = await Task.find({ columnId: columnId })
            allTaskFromColumn.forEach(async task => {
                task.attachments.forEach(attachment => {
                    fs.unlink(filePath(attachment.filename), (error) => console.log(error))
                })
            })
            await Task.deleteMany({ columnId: columnId })
            return await Column.findByIdAndDelete(columnId)
        }

        throw ApiError.AccessDenied()
    }
}

module.exports = new columnService()