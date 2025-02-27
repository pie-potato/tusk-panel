const Board = require("../mongooseModels/Board");
const Column = require("../mongooseModels/Column");
const Project = require("../mongooseModels/Project");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const ApiError = require('../exeptions/apiError.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { filePath } = require("../fileStorage.js");

class boardService {
    async getAllBoards(projectId) {
        return await Board.find({ projectId: projectId }).populate('createdBy', 'username')
    }

    async createBoard(userId, projectId, boardTitle) {
        const project = await Project.findById(projectId)
        if (!project) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role !== "admin" && user.role === "manager" || user.role === "admin" && user.role !== "manager" ) {
            throw ApiError.AccessDenied()
        }

        const newBoard = new Board({
            title: boardTitle,
            createdBy: userId,
            projectId: projectId
        })

        return await newBoard.save()
    }

    async changeBoard(userId, boardId, newBoardTitle) {
        const board = await Board.findById(boardId)
        if (!board) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role === "admin" || user.role === "manager") {
            return await Board.findByIdAndUpdate(boardId, { title: newBoardTitle }, { new: true })
        }

        throw ApiError.AccessDenied()
    }

    async deleteBoard(userId, boardId) {
        const board = await Board.findById(boardId)
        if (!board) {
            throw ApiError.BadRequest()
        }

        const user = await User.findById(userId)
        if (user.role === "admin" || user.role === "manager") {
            const allColumnsFromBoard = await Column.find({ boardId: boardId })
            allColumnsFromBoard.forEach(async column => {
                const allTaskFromColumn = await Task.find({ columnId: column._id })
                allTaskFromColumn.forEach(task => {
                    task.attachments.forEach(attachment => {
                        fs.unlink(filePath(attachment.filename), (error) => {
                            console.log(error)
                        });
                    })
                })
            })
            allColumnsFromBoard.forEach(async column => await Task.deleteMany({ columnId: column._id }))
            await Column.deleteMany({ boardId: boardId })
            return await Board.findByIdAndDelete(boardId)
        }

        throw ApiError.AccessDenied()
    }
}

module.exports = new boardService()