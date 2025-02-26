const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    req.userId = jwt.verify(req.headers.authorization?.replace("Bearer ", ""), "PiePotato").userId
    next()
}