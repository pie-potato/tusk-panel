const { Router } = require('express');
const projectControllers = require('../controllers/projectControllers');

const projectRouter = new Router()

projectRouter.get('', projectControllers.getAllProject);
projectRouter.post('', projectControllers.createProject);
projectRouter.delete('/:projectId', projectControllers.deleteProject);

module.exports = projectRouter