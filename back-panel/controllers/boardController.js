const Board = require("../mongooseModels/Board");
const Column = require("../mongooseModels/Column");
const Project = require("../mongooseModels/Project");
const Task = require("../mongooseModels/Task");
const User = require("../mongooseModels/User");
const { emitEventToRoom } = require("../socket/socketService");
const jwt = require('jsonwebtoken');
class boardController {
    async getAllBoards(req, res) {
        try {
            const boards = await Board.find({ projectId: req.params.projectId }).populate('createdBy', 'username');
            res.json(boards);
        } catch (error) {
            // Обработка ошибок
            res.status(500).json({ error: "Ошибка при получении досок." })
        }
    }

    async createBoard(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const currentUser = await User.findById(decoded.userId);
            if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
                return res.status(403).json({ message: 'Нет прав для создания доски.' });
            }
            const { title, projectId } = req.body;
            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(403).json({ message: 'Нет доступа к этому проекту.' });
            }
            const newBoard = new Board({
                title,
                createdBy: currentUser._id,
                projectId
            });
            const savedBoard = await newBoard.save();
            console.log(savedBoard);

            emitEventToRoom(projectId, "addBoard", savedBoard);

            res.json(savedBoard);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании доски.' });
        }
    }

    async changeBoard(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const currentUser = await User.findById(decoded.userId);
            const board = await Board.findById(req.params.boardId);

            if (!board) {
                return res.status(404).json({ message: 'Доска не найдена.' });
            }

            if (currentUser.role === 'admin' && currentUser.role !== 'manager' || currentUser.role !== 'admin' && currentUser.role === 'manager') { // Check if current user is admin or the creator of the board
                return res.status(403).json({ message: 'Нет прав для редактирования этой доски.' });
            }

            board.title = req.body.title;
            const updatedBoard = await board.save();

            res.json(updatedBoard);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении доски.' });
        }
    }

    async deleteBoard(req, res) {
        try {
            // First, delete all associated tasks:
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const currentUser = await User.findById(decoded.userId);
            if (currentUser.role !== 'admin' && currentUser.role !== 'manager') { // Check if current user is admin or the creator of the board
                return res.status(403).json({ message: 'Нет прав для редактирования этой доски.' });
            }

            const fetchAllColumns = await Column.find({ boardId: req.params.boardId })
            fetchAllColumns.forEach(async (e) => {
                const allColumnTasks = await Task.find({ columnId: e._id })
                allColumnTasks.forEach(e => {
                    e.attachments.forEach(e => {
                        const filePath = path.join(__dirname, 'uploads', e.filename);
                        fs.unlinkSync(filePath);
                    })
                })
            })
            fetchAllColumns.forEach(async (e) => await Task.deleteMany({ columnId: e._id }))

            await Column.deleteMany({ boardId: req.params.boardId });
            // Then, delete the column:
            const deletedBoard = await Board.findByIdAndDelete(req.params.boardId);

            emitEventToRoom(req.params.projectId, "deleteBoard", deletedBoard);
            res.json({ message: 'Column and associated tasks deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting column' });
        }
    }
}

module.exports = new boardController()