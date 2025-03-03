const { Router } = require("express");
const taskController = require("../controllers/taskController");
const { upload } = require("../fileStorage");
const verifyUserAccess = require("../middleware/verifyUserAccess");


const taskRouter = new Router()

taskRouter.get('/uploads/:filename', taskController.getTaskFile)

taskRouter.post('/:projectId', verifyUserAccess, taskController.createTask);

taskRouter.post('/:taskId/upload/:projectId', verifyUserAccess, upload.single('file'), taskController.addTaskFile)

taskRouter.put('/:taskId/assign/:projectId', verifyUserAccess, taskController.changeTaskAssign)
taskRouter.put('/:id/:projectId', verifyUserAccess, taskController.changeTask)
taskRouter.put('/:id/date/:projectId', verifyUserAccess, taskController.changeTaskDate);
taskRouter.put('/description/:id/:projectId', verifyUserAccess, taskController.changeTaskDescription);
taskRouter.delete('/:taskId/assign/:userId/:projectId', verifyUserAccess, taskController.deleteTaskAssign)
taskRouter.delete('/:taskId/:projectId', verifyUserAccess, taskController.deleteTask)

taskRouter.delete('/:taskId/attachments/:filename/:projectId', verifyUserAccess, taskController.deleteTaskFile)

module.exports = taskRouter