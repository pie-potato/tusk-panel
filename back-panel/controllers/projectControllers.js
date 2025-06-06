const projectService = require('../services/projectService.js');
const { emitEventToRoom } = require('../socket/socketService.js');

class projectController {
    async getAllProject(req, res, next) {
        try {
            const projects = await projectService.getAllProject(req.userId)
            res.json(projects);
        } catch (error) {
            next(error)
        }
    }

    async createProject(req, res, next) {
        try {
            const savedProject = await projectService.createProject(req.body.title, req.body.members);
            emitEventToRoom('/project', 'addProject', savedProject)
            res.json(savedProject);
        } catch (error) {
            next(error)
        }
    }

    async deleteProject(req, res, next) {
        try {
            const deleteProjects = await projectService.deleteProject(req.params.projectId)
            emitEventToRoom('/project', "deleteProject", deleteProjects)
            return res.json(deleteProjects);
        } catch (error) {
            next(error)
        }
    }

    async deleteUserFromProject(req, res, next) {
        try {
            const updateProject = await projectService.deleteUserFromProject(req.params.projectId, req.params.userId)
            emitEventToRoom('/project', 'updateProject', updateProject)
            return res.json(updateProject);
        } catch (error) {
            next(error)
        }
    }

    async updateProject(req, res, next) {
        try {
            const updateProject = await projectService.updateProject(req.params.projectId, req.body.title, req.body.members)
            emitEventToRoom('/project', 'updateProject', updateProject)
            return res.json(updateProject);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new projectController()