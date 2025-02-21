const { Router } = require('express');
const projectControllers = require('../controllers/projectControllers');

const projectRouter = new Router()

projectRouter.get('/api/projects', projectControllers.getAllProject);

projectRouter.post('/api/projects', projectControllers.createProject);

projectRouter.delete('/api/project/:projectId', projectControllers.deleteProject);