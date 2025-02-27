const { Router } = require("express");
const columnController = require("../controllers/columnController");
const decodedUserId = require("../middleware/decodedUserId");

const columnRouter = new Router()

columnRouter.get('/:boardId', columnController.getAllColumns)
columnRouter.post('/:boardId/:projectId', decodedUserId, columnController.createColumn)
columnRouter.put('/:columnId/:projectId', decodedUserId, columnController.changeColumn)
columnRouter.delete('/:columnId/:projectId', decodedUserId, columnController.deleteColumn)

module.exports = columnRouter