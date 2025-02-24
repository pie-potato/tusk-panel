const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");


class taskController {
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
}