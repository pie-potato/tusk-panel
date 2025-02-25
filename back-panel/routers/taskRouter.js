const { Router } = require("express");
const taskController = require("../controllers/taskController");
const { upload } = require("../fileStorage");


const taskRouter = new Router()

taskRouter.get('/uploads/:filename', taskController.getTaskFile)

taskRouter.post('/:projectId', taskController.createTask);

taskRouter.post('/:taskId/upload/:projectId', upload.single('file'), taskController.addTaskFile)

taskRouter.put('/:taskId/assign/:projectId', taskController.changeTaskAssign)
taskRouter.put('/:id/:projectId', taskController.changeTask)
taskRouter.put('/:id/date/:projectId', taskController.changeTaskDate);
taskRouter.put('/description/:id/:projectId', taskController.changeTaskDescription);
taskRouter.delete('/:taskId/assign/:userId/:projectId', taskController.deleteTaskAssign)
taskRouter.delete('/:taskId/:projectId', taskController.deleteTask)

taskRouter.delete('/:taskId/attachments/:filename/:projectId', taskController.deleteTaskFile)

module.exports = taskRouter