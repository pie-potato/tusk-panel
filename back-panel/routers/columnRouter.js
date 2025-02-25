const { Router } = require("express");
const columnController = require("../controllers/columnController");

const columnRouter = new Router()

columnRouter.get('/:boardId', columnController.getAllColumns)
columnRouter.post('/:projectId', columnController.createColumn)
columnRouter.put('/:columnId/:projectId', columnController.changeColumn)
columnRouter.delete('/:columnId/:projectId', columnController.deleteColumn)

module.exports = columnRouter