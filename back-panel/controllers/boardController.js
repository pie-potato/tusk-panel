const boardService = require("../services/boardService");
const { emitEventToRoom } = require("../socket/socketService");

class boardController {
    async getAllBoards(req, res, next) {
        try {
            const boards = await boardService.getAllBoards(req.params.projectId)
            res.json(boards);
        } catch (error) {
            next(error)
        }
    }

    async createBoard(req, res, next) {
        try {
            const { projectId } = req.params
            const { title } = req.body;
            const newBoard = await boardService.createBoard(req.userId, projectId, title)
            emitEventToRoom(projectId, "addBoard", newBoard);
            res.json(newBoard);
        } catch (error) {
            next(error)
        }
    }

    async changeBoard(req, res, next) {
        try {
            const updatedBoard = await boardService.changeBoard(req.params.boardId, req.body.title)
            emitEventToRoom(req.params.projectId, "addBoard", newBoard);
            res.json(updatedBoard);
        } catch (error) {
            next(error)
        }
    }

    async deleteBoard(req, res, next) {
        try {
            const deletedBoard = await boardService.deleteBoard(req.params.boardId);
            emitEventToRoom(req.params.projectId, "deleteBoard", deletedBoard);
            res.json({ message: 'Column and associated tasks deleted' });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new boardController()