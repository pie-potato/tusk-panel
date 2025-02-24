const { Router } = require("express")

const taskRouter = new Router()

taskRouter.post('/api/:projectId/tasks', async (req, res) => {

});
taskRouter.put('/api/:projectId/tasks/:taskId/assign', async (req, res) => {

})
taskRouter.put('/api/:projectId/tasks/:id', async (req, res) => {

})
taskRouter.put('/api/:projectId/tasks/:id/date', async (req, res) => {

});
taskRouter.put('/api/:projectId/tasks/:id/description', async (req, res) => {

});
taskRouter.delete('/api/:projectId/tasks/:taskId/assign/:userId', async (req, res) => {

})