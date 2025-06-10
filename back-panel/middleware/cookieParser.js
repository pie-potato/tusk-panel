module.exports = (req, res, next) => {
    const { headers: { cookie } } = req
    if (!cookie) return next()
    const parse = cookie.split(';').reduce((res, element) => {
        const data = element.trim().split('=')
        return { ...res, [data[0]]: data[1] }
    }, {})
    req.cookies = parse
    next()
}