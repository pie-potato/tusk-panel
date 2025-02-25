const { filePath } = require("../fileStorage");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const { emitEventToRoom } = require("../socket/socketService");
const jwt = require('jsonwebtoken');
const fs = require('fs');


class taskController {

    async getTaskFile(req, res) {
        res.sendFile(filePath(req.params.filename), (err) => {
            if (err) {
                console.error("Ошибка при отправке файла:", err);
                res.status(404).json({ message: 'Файл не найден.' });
            }
        });
    }

    async createTask(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const projectId = req.params.projectId
            const newTask = new Task({
                title: req.body.title,
                columnId: req.body.columnId,
                createdBy: decoded.userId // Store the ID of the user who created the task
            });
            const savedTask = await newTask.save();
            const column = await Column.findById(req.body.columnId)
            await Column.findByIdAndUpdate(req.body.columnId, { $push: { tasks: savedTask._id } });
            emitEventToRoom(projectId, 'addTask', savedTask);
            res.json(savedTask);
        } catch (error) {
            res.status(500).json({ error: 'Error adding task' });
        }
    }

    async addTaskFile(req, res) {
        try {
            // ... (authentication/authorization logic, similar to other protected routes)
            if (!req.file) {
                return res.status(400).json({ message: 'Файл не выбран.' });
            }
            console.log(req.params.taskId);

            const task = await Task.findById(req.params.taskId);
            if (!task) {
                // Delete the uploaded file if the task doesn't exist
                fs.unlinkSync(req.file.path); // Remove the file from the server
                return res.status(404).json({ message: 'Задача не найдена.' });
            }
            const projectId = req.params.projectId
            const column = await Column.findById(task.columnId)
            task.attachments = task.attachments || []; // Initialize attachments array if it doesn't exist
            const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
            const nameFile = { filename: req.file.filename, originalname: originalName }
            task.attachments.push(nameFile); // Use originalname for display


            await task.save();
            console.log({ filename: req.file.filename, originalname: originalName });
            emitEventToRoom(projectId, "addAttachmentsFile", { nameFile, taskId: task._id, columnId: column._id });

            res.json({ message: 'Файл успешно загружен.', nameFile });
        } catch (error) {
            // Delete the uploaded file if an error occurs
            if (req.file) {
                fs.unlinkSync(req.file.path); // Remove the file from the server
            }
            console.error('Ошибка при загрузке файла:', error);
            res.status(500).json({ error: 'Ошибка при загрузке файла.' });
        }
    }

    async changeTaskAssign(req, res) {
        try {
            const projectId = req.params.projectId
            const { userId } = req.body;
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.taskId,
                { $push: { assignedTo: userId } },
                { new: true }
            ).populate('createdBy').populate('assignedTo', 'username'); // Populate after updating
            const column = await Column.findById(updatedTask.columnId)
            const assignedUser = await User.findById(userId)
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
            emitEventToRoom(projectId, 'addTaskAssing', { taskId: updatedTask._id, columnId: updatedTask.columnId, assignedTo: assignedUser });
            console.log(assignedUser);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Error assigning task' });
        }
    }

    async changeTask(req, res) {
        try {
            const projectId = req.params.projectId
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
                .populate('createdBy')
                .populate('assignedTo', 'username');
            const column = await Column.findById(updatedTask.columnId)
            if (!updatedTask) {
                return res.status(404).json({ message: 'Задача не найдена.' });

            }
            emitEventToRoom(projectId, 'updateTask', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    }

    async changeTaskDate(req, res) {
        try {
            const projectId = req.params.projectId
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, { startDate: req.body.startDate, endDate: req.body.endDate }, { new: true })
                .populate('createdBy')
                .populate('assignedTo', 'username');
            const column = await Column.findById(updatedTask.columnId)
            if (!updatedTask) {
                return res.status(404).json({ message: 'Задача не найдена.' });

            }
            console.log(updatedTask);

            emitEventToRoom(projectId, 'updateTask', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    }

    async changeTaskDescription(req, res) {
        try {
            const projectId = req.params.projectId
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, { description: req.body.description }, { new: true })
                .populate('createdBy')
                .populate('assignedTo', 'username');
            const column = await Column.findById(updatedTask.columnId)
            if (!updatedTask) {
                return res.status(404).json({ message: 'Задача не найдена.' });

            }
            console.log(updatedTask);

            emitEventToRoom(projectId, 'updateTask', updatedTask);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    }
    async deleteTaskAssign(req, res) {
        try {
            const projectId = req.params.projectId
            const taskId = req.params.taskId;
            const userIdToRemove = req.params.userId;
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { $pull: { assignedTo: userIdToRemove } },  // Use $pull to remove the userId
                { new: true }
            )
                .populate('createdBy')
                .populate('assignedTo', 'username');
            const column = await Column.findById(updatedTask.columnId)
            const assignedUser = await User.findById(userIdToRemove)
            emitEventToRoom(projectId, 'deleteTaskAssing', { taskId: updatedTask._id, columnId: updatedTask.columnId, assignedTo: assignedUser });
            res.json(updatedTask);
        } catch (error) {
            console.error('Error unassigning user:', error);
            res.status(500).json({ error: 'Ошибка при удалении назначения.' });
        }
    }
    async deleteTask(req, res) {
        try {
            const projectId = req.params.projectId
            const taskId = req.params.taskId;
            const deleteTask = await Task.findByIdAndDelete(taskId)
            emitEventToRoom(projectId, 'deleteTask', deleteTask);
            res.json(deleteTask);
        } catch (error) {
            console.error('Error unassigning user:', error);
            res.status(500).json({ error: 'Ошибка при удалении назначения.' });
        }
    }
    async deleteTaskFile(req, res) {
        try {
            // ... (authentication/authorization logic)

            const projectId = req.params.projectId
            const task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).json({ message: 'Задача не найдена.' });
            }

            const column = await Column.findById(task.columnId)
            const filename = req.params.filename;

            // Find the attachment index
            const attachmentIndex = task.attachments.findIndex(attachment => attachment.filename === filename);
            if (attachmentIndex === -1) {
                return res.status(404).json({ message: 'Вложение не найдено.' });
            }

            // Remove the attachment from the array
            const removedAttachment = task.attachments.splice(attachmentIndex, 1)[0];
            await task.save();

            // Delete the file from the uploads directory
            // const filePath = path.join(__dirname, 'uploads', removedAttachment.filename);
            fs.unlinkSync(filePath(removedAttachment.filename));  // Delete the file
            console.log(filename, removedAttachment);

            emitEventToRoom(projectId, "deleteAttachmentsFile", { removedAttachment, taskId: task._id, columnId: column._id });

            res.json({ message: 'Вложение успешно удалено.' });
        } catch (error) {
            console.error('Ошибка при удалении вложения:', error);
            res.status(500).json({ error: 'Ошибка при удалении вложения.' });
        }
    }
}

module.exports = new taskController()