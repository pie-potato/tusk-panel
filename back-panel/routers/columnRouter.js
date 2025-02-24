const { Router } = require("express");
const columnController = require("../controllers/columnController");

const columnRouter = new Router()

columnRouter.get('/api/boards/:boardId/columns', columnController.getAllColumns)
columnRouter.post('/api/:projectId/columns', columnController.createColumn)
columnRouter.put('/api/:projectId/columns/:id', columnController.changeColumn)
columnRouter.delete('/api/:projectId/columns/:id/', columnController.deleteColumn)