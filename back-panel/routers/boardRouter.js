const { Router } = require("express");
const boardController = require("../controllers/boardController");
const decodedUserId = require("../middleware/decodedUserId");

const boardRouter = new Router()

boardRouter.get('/:projectId', boardController.getAllBoards)
boardRouter.post('/:projectId', decodedUserId, boardController.createBoard)
boardRouter.put('/:boardId/:projectId', decodedUserId, boardController.changeBoard)
boardRouter.delete('/:boardId/:projectId', decodedUserId, boardController.deleteBoard)

module.exports = boardRouter