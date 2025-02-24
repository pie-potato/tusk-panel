const Project = require('../mongooseModels/Project.js');
const User = require('../mongooseModels/User.js');
const Column = require('../mongooseModels/Column.js');
const Board = require('../mongooseModels/Board.js');
const jwt = require('jsonwebtoken');
const projectservice = require('../services/projectservice.js');
const { emitEventToRoom } = require('../socket/socketService.js');

class projectController {
    async getAllProject(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decodedUserId = jwt.verify(token, 'PiePotato').userId;
            const user = await User.findById(decodedUserId)
            const projects = await projectservice.getAllProject(user)
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении проектов.' });
        }
    }

    async createProject(req, res) {
        try {
            // ... (authentication/authorization - only admins can create projects)
            const { title, members } = req.body;
            const newProject = new Project({ title, members });
            const savedProject = await newProject.save();
            emitEventToRoom('/project', 'addProject', savedProject)
            res.json(savedProject);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании проекта.' });
        }
    }

    async deleteProject(req, res) {
        try {
            const projectId = req.params.projectId
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');
            const userId = decoded.userId;
            const user = await User.findById(userId)
            if (user.role === 'admin' || user.role === 'manager') {
                const fetchAllBoards = await Board.find({ projectId: projectId })
                const fetchAllColumns = fetchAllBoards.forEach(async (e) => {
                    const column = await Column.find({ boardId: e._id })
                    column.forEach(async (e) => {
                        const allColumnsTask = await Task.find({ columnId: e._id })
                        allColumnsTask.forEach(e => {
                            e.attachments.forEach(e => {
                                const filePath = path.join(__dirname, 'uploads', e.filename);
                                fs.unlinkSync(filePath);
                            })
                        })
                        await Task.deleteMany({ columnId: e._id })
                    })
                    await Column.deleteMany({ boardId: e._id })
                })
                await Board.deleteMany({ projectId: projectId })
                const deleteProjects = await Project.findOneAndDelete({ _id: projectId })
                emitEventToRoom('/project', "deleteProject", deleteProjects)
                return res.json(deleteProjects);
            }
            return res.status(403).json({ message: 'Нет прав на удаление' })
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении проектов.' });
        }
    }
}

module.exports = new projectController()