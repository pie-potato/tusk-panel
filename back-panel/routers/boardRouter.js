const { Router } = require("express");
const boardController = require("../controllers/boardController");

const boardRouter = new Router()

boardRouter.get('/:projectId', boardController.getAllBoards)
boardRouter.post('', boardController.createBoard)
boardRouter.put('/:boardId', boardController.changeBoard)
boardRouter.delete('/:boardId/:projectId', boardController.deleteBoard)

module.exports = boardRouter