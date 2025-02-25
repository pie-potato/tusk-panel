const { Router } = require('express');
const projectControllers = require('../controllers/projectControllers');

const projectRouter = new Router()

projectRouter.get('', projectControllers.getAllProject);
projectRouter.post('', projectControllers.createProject);
projectRouter.put('/:projectId/:userId', projectControllers.deleteUserFromProject)
projectRouter.delete('/:projectId', projectControllers.deleteProject);

module.exports = projectRouter