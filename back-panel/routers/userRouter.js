const { Router } = require("express");
const userController = require('../controllers/userController.js');
const verifyAdminAccess = require("../middleware/verifyAdminAccess.js");
const verifyUserAccess = require("../middleware/verifyUserAccess.js");
const decodedUserId = require("../middleware/decodedUserId.js");

const userRouter = new Router()

userRouter.get('', decodedUserId, verifyUserAccess, userController.getUserData)
userRouter.get('/:projectId', decodedUserId, verifyUserAccess, userController.getUserData)
userRouter.get('/profile', decodedUserId, userController.getUserProfile)
userRouter.get('/admin', decodedUserId, verifyAdminAccess, userController.getAllUserData)

userRouter.post('/login', userController.loginUser)
userRouter.post('/logout', userController.logoutUser)
userRouter.post('/admin', decodedUserId, verifyAdminAccess, userController.adminUser)

userRouter.put('/profile', decodedUserId,  userController.changeUserData)
userRouter.put('/admin/role/:userId', decodedUserId, verifyAdminAccess, userController.changeUserRole)
userRouter.put('/admin/:userId', decodedUserId, verifyAdminAccess, userController.updateUserData)

module.exports = userRouter