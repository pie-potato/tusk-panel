const jwt = require('jsonwebtoken');
const ApiError = require('../exeptions/apiError');

module.exports = (req, res, next) => {
    if (!req.cookies.token) {
        return next(ApiError.AccessDenied())
    }
    req.userId = jwt.verify(req.cookies.token?.replace("Bearer ", ""), "PiePotato").userId
    next()
}