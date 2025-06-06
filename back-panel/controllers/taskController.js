const { filePath } = require("../fileStorage");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const { emitEventToRoom } = require("../socket/socketService");
const fs = require('fs');
const ApiError = require("../exeptions/apiError");
const taskService = require("../services/taskService");


class taskController {

    async getTaskFile(req, res, next) {
        try {
            res.download(filePath(req.params.filename))
        } catch (error) {
            next(error)
        }
    }

    async createTask(req, res, next) {
        try {
            const savedTask = await taskService.createTask(req.userId, req.body.columnId, req.body.title,)
            emitEventToRoom(req.params.projectId, 'addTask', savedTask);
            res.json(savedTask);
        } catch (error) {
            next(error)
        }
    }

    async addTaskFile(req, res, next) {
        try {
            const uploadedTaskFile = await taskService.addTaskFile(req.params.taskId, req.file)
            emitEventToRoom(req.params.projectId, "addAttachmentsFile", uploadedTaskFile)
            res.json({ message: 'Файл успешно загружен.' })
        } catch (error) {
            if (req.file) {
                fs.unlink(filePath(req.file.filename), (error) => console.error(error))
            }
            next(error)
        }
    }

    async changeTaskAssign(req, res, next) {
        try {
            const updatedTask = await taskService.changeTaskAssign(req.params.taskId, req.body.userId)
            emitEventToRoom(req.params.projectId, 'addTaskAssing', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            next(error)
        }
    }

    async changeTask(req, res, next) {
        try {
            const updatedTask = await taskService.changeTask(req.params.id, req.body.title)
            emitEventToRoom(req.params.projectId, 'updateTask', updatedTask)
            res.json(updatedTask)
        } catch (error) {
            next(error)
        }
    }

    async changeTaskDate(req, res, next) {
        try {
            const updatedTask = await taskService.changeTaskDate(req.params.id, req.body.startDate, req.body.endDate)
            emitEventToRoom(req.params.projectId, 'updateTask', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            next(error)
        }
    }

    async changeTaskDescription(req, res, next) {
        try {
            const updatedTask = await taskService.changeTaskDescription(req.params.id, req.body.description)
            emitEventToRoom(req.params.projectId, 'updateTask', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            next(error)
        }
    }
    async deleteTaskAssign(req, res, next) {
        try {
            const updatedTask = await taskService.deleteTaskAssign(req.params.taskId, req.params.userId)
            emitEventToRoom(req.params.projectId, 'deleteTaskAssing', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            next(error)
        }
    }
    async deleteTask(req, res, next) {
        try {
            const deleteTask = await taskService.deleteTask(req.params.taskId)
            emitEventToRoom(req.params.projectId, 'deleteTask', deleteTask);
            res.json(deleteTask);
        } catch (error) {
            next(error)
        }
    }
    async deleteTaskFile(req, res, next) {
        try {
            const task = await taskService.deleteTaskFile(req.params.taskId, req.params.filename)
            emitEventToRoom(req.params.projectId, "deleteAttachmentsFile", task);
            res.json({ message: 'Вложение успешно удалено.' });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new taskController()