const { filePath } = require("../fileStorage");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const fs = require('fs');
const ApiError = require("../exeptions/apiError");

class taskService {
    async createTask(userId, columnId, taskTitle) {
        const column = await Column.findById(columnId)
        if (!column) {
            ApiError.BadRequest()
        }
        const newTask = new Task({
            title: taskTitle,
            columnId: columnId,
            createdBy: userId
        })
        const savedTask = await newTask.save()
        await Column.findByIdAndUpdate(columnId, { $push: { tasks: savedTask._id } });
        return savedTask
    }

    async addTaskFile(taskId, file) {
        const task = await Task.findById(taskId)
        if (!task) {
            fs.unlink(filePath(file.filename), (error) => console.error(error))
            throw ApiError.BadRequest()
        }
        task.attachments = task.attachments || []
        const nameFile = {
            filename: file.filename,
            originalname: Buffer.from(file.originalname, 'binary').toString('utf8')
        }
        task.attachments.push(nameFile)
        await task.save()
        return { nameFile, taskId: taskId, columnId: task.columnId }
    }

    async changeTaskAssign(taskId, assignedUserId) {
        const task = await Task.findByIdAndUpdate(taskId, { $push: { assignedTo: assignedUserId } }, { new: true })
            .populate('assignedTo', 'username')
        if (!task) {
            throw ApiError.BadRequest()
        }
        /*
            if (assignedUser?.mail) {
                const mailOptions = {
                    from: `kartushin_is@surgu.ru`,
                    to: `${assignedUser.mail}`,
                    subject: 'Тестовое письмо с для оповешения о назначении на задачу',
                    text: 'Это тестовое письмо, отправленное с сервера Картушиным Иваном Сергеевичем.\n Вот так я буду уведомлять пользователей, что на них назначена задача.'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Ошибка при отправке письма:', error);
                    } else {
                        console.log('Письмо успешно отправлено:', info.response);
                    }
                });
            }
        */
        const assignedUser = await User.findById(assignedUserId, ' -password -__v')
        return { taskId: task._id, columnId: task.columnId, assignedTo: assignedUser }
    }

    async changeTask(taskId, newTaskTitle) {
        const task = await Task.findByIdAndUpdate(taskId, { title: newTaskTitle }, { new: true })
            .populate('createdBy')
            .populate('assignedTo', 'username');
        if (!task) {
            throw ApiError.BadRequest()
        }
        return task
    }

    async changeTaskDate(taskId, startDate, endDate) {
        const task = await Task.findByIdAndUpdate(taskId, { startDate: startDate, endDate: endDate }, { new: true })
            .populate('createdBy')
            .populate('assignedTo', 'username');
        if (!task) {
            throw ApiError.BadRequest()
        }
        return task
    }

    async changeTaskDescription(taskId, newTaskDescription) {
        const task = await Task.findByIdAndUpdate(taskId, { description: newTaskDescription }, { new: true })
        if (!task) {
            throw ApiError.BadRequest()
        }
        return task
    }

    async deleteTaskAssign(taskId, unssignedUserId) {
        const task = await Task.findByIdAndUpdate(taskId, { $pull: { assignedTo: unssignedUserId } }, { new: true })
            .populate('createdBy')
            .populate('assignedTo', 'username');
        if (!task) {
            throw ApiError.BadRequest()
        }
        return { taskId: task._id, columnId: task.columnId, assignedTo: unssignedUserId }
    }

    async deleteTask(taskId) {
        const task = await Task.findByIdAndDelete(taskId)
        if (!task) {
            throw ApiError.BadRequest()
        }
        task.attachments.forEach(attachment => {
            fs.unlink(filePath(attachment.filename), (error) => console.log(error))
        })
        return task
    }

    async deleteTaskFile(taskId, deletedFilename) {
        const task = await Task.findById(taskId)
        if (!task) {
            throw ApiError.BadRequest()
        }
        const removedAttachment = task.attachments.splice(task.attachments.findIndex(e => e.filename === deletedFilename), 1)[0]
        fs.unlinkSync(filePath(removedAttachment.filename))
        await task.save()
        return { removedAttachment, taskId: task._id, columnId: task.columnId }
    }
}

module.exports = new taskService()