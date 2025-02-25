const Board = require("../mongooseModels/Board");
const Column = require("../mongooseModels/Column");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const jwt = require('jsonwebtoken');
const { emitEventToRoom } = require("../socket/socketService");

class columnController {
    async getAllColumns(req, res) {
        try {
            const columns = await Column.find({ boardId: req.params.boardId }).populate({
                path: 'tasks',
                populate: {
                    path: 'createdBy assignedTo' // Populate both createdBy and assignedTo
                }
            });
            res.json(columns);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении колонок' });
        }
    }

    async createColumn(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const currentUser = await User.findById(decoded.userId);
            const { title, boardId } = req.body;  // Get boardId from request
            const projectId = req.params.projectId
            const board = await Board.findById(boardId);
            if (!board) {
                return res.status(404).json({ message: 'Доска не найдена' });
            }

            if (currentUser.role !== 'admin' && board.createdBy.toString() !== currentUser._id.toString()) {
                return res.status(403).json({ message: 'Нет прав для создания колонки на этой доске' });
            }

            const newColumn = new Column({ title, boardId });
            const savedColumn = await newColumn.save();
            const populatedColumn = await Column.findById(savedColumn._id).populate('tasks');

            emitEventToRoom(projectId, "addColumn", populatedColumn);

            res.json(populatedColumn);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании колонки' });
        }
    }

    async changeColumn(req, res) {
        try {
            const updatedColumn = await Column.findByIdAndUpdate(req.params.columnId, { title: req.body.title }, { new: true });
            console.log(updatedColumn);

            const projectId = req.params.projectId
            emitEventToRoom(projectId, 'updateColumn', updatedColumn)
            res.json(updatedColumn);
        } catch (error) {
            res.status(500).json({ error: 'Error updating column' });
        }
    }

    async deleteColumn(req, res) {
        try {

            const column = await Column.findById(req.params.columnId);
            const projectId = req.params.projectId
            if (!column) {
                return res.status(404).json({ message: 'Колонка не найдена.' });
            }
            const tasks = await Task.find({ columnId: req.params.columnId })
            tasks.forEach(e => {
                e.attachments.forEach(e => {
                    const filePath = path.join(__dirname, 'uploads', e.filename)
                    fs.unlinkSync(filePath)
                })
            })
            await Task.deleteMany({ columnId: req.params.columnId }); // Удаляем все задачи в колонке
            // console.log(tasks);

            await Column.findByIdAndDelete(req.params.columnId);
            emitEventToRoom(projectId, 'deleteColumn', req.params.columnId);
            res.json({ message: 'Колонка успешно удалена.' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting column' });
        }
    }
}

module.exports = new columnController()