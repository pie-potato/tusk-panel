const ApiError = require('../exeptions/apiError')
const Chat = require('../mongooseModels/Chat')
const User = require('../mongooseModels/User')

module.exports = async (req, res, next) => {
    const user = await User.findById(req.userId)
    if (user.role === "admin" || user.role === "manager") {
        return next()
    }
    const chat = await Chat.find({ taskId: req.params.taskId, participants: user._id })
    if (!chat) next(ApiError.AccessDenied())
    next()
}