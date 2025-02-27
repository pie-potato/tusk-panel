const Board = require("../mongooseModels/Board");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const jwt = require('jsonwebtoken');
const { emitEventToRoom } = require("../socket/socketService");
const columnService = require("../services/columnService");

class columnController {
    async getAllColumns(req, res, next) {
        try {
            const columns = await columnService.getAllColumns(req.params.boardId)
            res.json(columns);
        } catch (error) {
            next(error)
        }
    }

    async createColumn(req, res, next) {
        try {
            const populatedColumn = await columnService.createColumn(req.userId, req.params.boardId, req.body.title)
            emitEventToRoom(req.params.projectId, "addColumn", populatedColumn);
            res.json(populatedColumn);
        } catch (error) {
            next(error)
        }
    }

    async changeColumn(req, res, next) {
        try {
            const updatedColumn = await columnService.changeColumn(req.userId, req.params.columnId, req.body.title);
            emitEventToRoom(req.params.projectId, 'updateColumn', updatedColumn)
            res.json(updatedColumn);
        } catch (error) {
            next(error)
        }
    }

    async deleteColumn(req, res, next) {
        try {
            await columnService.deleteColumn(req.userId, req.params.columnId);
            emitEventToRoom(req.params.projectId, 'deleteColumn', req.params.columnId);
            res.json({ message: 'Колонка успешно удалена.' });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new columnController()