const { Router } = require("express");
const columnController = require("../controllers/columnController");
const verifyUserAccess = require("../middleware/verifyUserAccess");


const columnRouter = new Router()

columnRouter.get('/:boardId', columnController.getAllColumns)
columnRouter.post('/:boardId/:projectId', verifyUserAccess, columnController.createColumn)
columnRouter.put('/:columnId/:projectId', verifyUserAccess, columnController.changeColumn)
columnRouter.delete('/:columnId/:projectId', verifyUserAccess, columnController.deleteColumn)

module.exports = columnRouter