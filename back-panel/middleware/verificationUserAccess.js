const ApiError = require("../exeptions/apiError")
const User = require("../mongooseModels/User")

module.exports = async (req, res, next) => {
    const user = await User.findById(req.userId)
    if (user.role === "admin" || user.role === "manager") {
        req.userRole = user.role
        return next()
    }
    next(ApiError.AccessDenied())
}