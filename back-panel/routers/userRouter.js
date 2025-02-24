const { Router } = require("express");
const userController = require('../controllers/userController.js')

const userRouter = new Router()

userRouter.post('/api/projects/:projectId/members', userController.addMemberToProject)
userRouter.delete('/api/projects/:projectId/members/:userId', userController.deleteMemberToProject)