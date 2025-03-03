const jwt = require('jsonwebtoken');
const ApiError = require('../exeptions/apiError');

module.exports = (req, res, next) => {
    if(!req.headers.authorization) {
        return next(ApiError.AccessDenied())
    }
    req.userId = jwt.verify(req.headers.authorization?.replace("Bearer ", ""), "PiePotato").userId
    next()
}