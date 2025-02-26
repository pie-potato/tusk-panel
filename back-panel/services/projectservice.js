const Project = require('../mongooseModels/Project.js');
const User = require('../mongooseModels/User.js');

class projectService {
    async getAllProject(userId) {
        const user = await User.findById(userId)
        if (user.role === 'admin' || user.role === 'manager') {
            const projects = await Project.find()
            return projects;
        }
        const projects = await Project.find({ 'members._id': user._id }).populate('members')
        return projects
    }

    async createProject(userId, title, members) {
        const user = await User.findById(userId)
        if (user.role === 'admin') {
            const newProject = new Project({ title, members });
            const saveProject = await newProject.save()
            return saveProject
        }
        throw new Error(401, "Недостаточно прав");
        return;
    }

    async deleteProject(req, res) {
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
            io.to('/project').emit("deleteProject", deleteProjects)
            return res.json(deleteProjects);
        }
        return res.status(403).json({ message: 'Нет прав на удаление' })
    }
}

module.exports = new projectService()