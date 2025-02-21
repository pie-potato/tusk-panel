const Project = require('../mongooseModels/Project.js');

class projectService {
    async getAllProject(user) {
        if (user.role === 'admin' || user.role === 'manager') {
            const projects = await Project.find()
            return projects;
        }
        const projects = await Project.find({ 'members._id': user._id }).populate('members')
        return projects
    }

    async createProject(req, res) {
        // ... (authentication/authorization - only admins can create projects)
        const { title, members } = req.body;
        const newProject = new Project({ title, members });
        const savedProject = await newProject.save();
        io.to('/project').emit('addProject', savedProject)
        res.json(savedProject);
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