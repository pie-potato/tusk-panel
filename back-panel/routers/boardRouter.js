const { Router } = require("express");
const boardController = require("../controllers/boardController");
const verifyUserAccess = require("../middleware/verifyUserAccess");


const boardRouter = new Router()

boardRouter.get('/:projectId', boardController.getAllBoards)
boardRouter.post('/:projectId', verifyUserAccess, boardController.createBoard)
boardRouter.put('/:boardId/:projectId', verifyUserAccess, boardController.changeBoard)
boardRouter.delete('/:boardId/:projectId', verifyUserAccess, boardController.deleteBoard)

module.exports = boardRouter