const { Router } = require("express");
const userController = require('../controllers/userController.js')

const userRouter = new Router()

userRouter.get('', userController.getUserData)
userRouter.get('/profile', userController.getUserProfile)
userRouter.get('/admin', userController.getAllUserData)

userRouter.post('/login', userController.loginUser)
userRouter.post('/admin', userController.adminUser)

userRouter.put('/profile', userController.changeUserData)
userRouter.put('/admin/role/:userId', userController.changeUserRole)
userRouter.put('/admin/:userId', userController.updateUserData)

module.exports = userRouter