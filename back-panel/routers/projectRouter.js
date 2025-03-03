const { Router } = require('express');
const projectControllers = require('../controllers/projectControllers');
const verifyUserAccess = require('../middleware/verifyUserAccess.js')

const projectRouter = new Router()

projectRouter.get('', projectControllers.getAllProject);
projectRouter.post('', verifyUserAccess, projectControllers.createProject);
projectRouter.put('/:projectId/:userId', verifyUserAccess, projectControllers.deleteUserFromProject)
projectRouter.delete('/:projectId', verifyUserAccess, projectControllers.deleteProject);

module.exports = projectRouter