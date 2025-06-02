const { Router } = require("express");
const taskController = require("../controllers/taskController");
const { upload } = require("../fileStorage");
const verifyUserAccess = require("../middleware/verifyUserAccess");
const decodedUserId = require("../middleware/decodedUserId");


const taskRouter = new Router()

taskRouter.get('/uploads/:filename', taskController.getTaskFile)

taskRouter.post('/:projectId', decodedUserId, verifyUserAccess, taskController.createTask);

taskRouter.post('/:taskId/upload/:projectId', decodedUserId, verifyUserAccess, upload.single('file'), taskController.addTaskFile)

taskRouter.put('/:taskId/assign/:projectId', decodedUserId, verifyUserAccess, taskController.changeTaskAssign)
taskRouter.put('/:id/:projectId', decodedUserId, verifyUserAccess, taskController.changeTask)
taskRouter.put('/:id/date/:projectId', decodedUserId, verifyUserAccess, taskController.changeTaskDate);
taskRouter.put('/description/:id/:projectId', decodedUserId, verifyUserAccess, taskController.changeTaskDescription);
taskRouter.delete('/:taskId/assign/:userId/:projectId', decodedUserId, verifyUserAccess, taskController.deleteTaskAssign)
taskRouter.delete('/:taskId/:projectId', decodedUserId, verifyUserAccess, taskController.deleteTask)

taskRouter.delete('/:taskId/attachments/:filename/:projectId', decodedUserId, verifyUserAccess, taskController.deleteTaskFile)

module.exports = taskRouter