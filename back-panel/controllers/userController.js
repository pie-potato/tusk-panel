const Project = require("../mongooseModels/Project");

class userController {
    async addMemberToProject(req, res) {
        try {
            const { userId } = req.body;
            const project = await Project.findById(req.params.projectId);
            if (!project) {
                return res.status(404).json({ message: 'Проект не найден.' });
            }
            // Check if user is already a member
            if (project.members.includes(userId)) {
                return res.status(400).json({ message: 'Пользователь уже является участником проекта.' });
            }
            project.members.push(userId);
            await project.save();
            res.json({ message: 'Пользователь успешно добавлен в проект.', project });
        } catch (error) {
            console.error('Error adding user to project:', error)
            res.status(500).json({ error: 'Ошибка при добавлении пользователя в проект.' });
        }
    }

    async deleteMemberToProject(req, res) {
        try {
            // ... (authentication/authorization - only admins and project managers)
            const project = await Project.findById(req.params.projectId);
            if (!project) {
                return res.status(404).json({ message: 'Проект не найден.' });
            }
            // Check if user is a member before removing
            const memberIndex = project.members.indexOf(req.params.userId);
            if (memberIndex === -1) {
                return res.status(400).json({ message: 'Пользователь не является участником проекта.' });
            }
            project.members.splice(memberIndex, 1);
            await project.save();
            res.json({ message: 'Пользователь успешно удален из проекта.', project });
        } catch (error) {
            console.error('Error removing user from project:', error)
            res.status(500).json({ error: 'Ошибка при удалении пользователя из проекта.' });
        }
    }
}

module.exports = new userController()