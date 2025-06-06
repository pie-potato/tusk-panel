const fs = require('fs');
const Board = require('../mongooseModels/Board.js');
const Column = require('../mongooseModels/Column.js');
const Project = require('../mongooseModels/Project.js');
const Task = require('../mongooseModels/Task.js');
const ApiError = require('../exeptions/apiError.js');
const { filePath } = require('../fileStorage.js');
const User = require('../mongooseModels/User.js');


class projectService {
    async getAllProject(userId) {
        const user = await User.findById(userId)
        if (user.role === 'admin' || user.role === 'manager') {
            return await Project.find()
        }
        return await Project.find({ 'members._id': userId }).populate('members')
    }

    async createProject(title, members) {
        const newProject = new Project({ title, members });
        const saveProject = await newProject.save()
        return saveProject
    }

    async deleteProject(projectId) {
        const fetchAllBoards = await Board.find({ projectId: projectId })
        fetchAllBoards.forEach(async (e) => {
            const column = await Column.find({ boardId: e._id })
            column.forEach(async (e) => {
                const allColumnsTask = await Task.find({ columnId: e._id })
                allColumnsTask.forEach(e => {
                    e.attachments.forEach(e => {
                        fs.unlinkSync(filePath(e.filename));
                    })
                })
                await Task.deleteMany({ columnId: e._id })
            })
            await Column.deleteMany({ boardId: e._id })
        })
        await Board.deleteMany({ projectId: projectId })
        const deleteProjects = await Project.findOneAndDelete({ _id: projectId })
        return deleteProjects
    }

    async deleteUserFromProject(projectId, deletedUserId) {
        return await Project.findByIdAndUpdate(projectId, { $pull: { members: { _id: deletedUserId } } }, { new: true })
    }

    async updateProject(projectId, title, members) {
        const updatedProject = await Project.findByIdAndUpdate(projectId, { title: title, members: members }, { new: true })
        return updatedProject
    }
}

module.exports = new projectService()