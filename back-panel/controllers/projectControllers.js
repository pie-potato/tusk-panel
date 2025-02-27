const Project = require('../mongooseModels/Project.js');
const projectService = require('../services/projectService.js');
const { emitEventToRoom } = require('../socket/socketService.js');

class projectController {
    async getAllProject(req, res, next) {
        try {
            const projects = await projectService.getAllProject(req.userId, req.userRole)
            res.json(projects);
        } catch (error) {
            next(error)
        }
    }

    async createProject(req, res, next) {
        try {
            const savedProject = await projectService.createProject(req.userId, req.body.title, req.body.members);
            emitEventToRoom('/project', 'addProject', savedProject)
            res.json(savedProject);
        } catch (error) {
            next(error)
        }
    }

    async deleteProject(req, res, next) {
        try {
            const deleteProjects = await projectService.deleteProject(req.userId, req.params.projectId)
            emitEventToRoom('/project', "deleteProject", deleteProjects)
            return res.json(deleteProjects);
        } catch (error) {
            next(error)
        }
    }

    async deleteUserFromProject(req, res, next) {
        try {
            const updateProject = await projectService.deleteUserFromProject(req.userId, req.params.projectId, req.params.userID)
            emitEventToRoom('/project', 'updateProject', updateProject)
            return res.json(updateProject);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new projectController()