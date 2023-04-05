const jwt = require('jsonwebtoken')
const SECRET = 'danieltools'
const conn = require('../db/index')

const middlewareAuth = (req, res, next) => {
    const token = req.headers['x-access-token']
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end()
        
        req.userId = decoded.userId
        req.role = decoded.role
        next()
    })
}

const authRole = (req, res, next) => {
    const userRole = req.role

    if (userRole === 'admin') {
        next()
    } else {
        return res.status(403).send({ error: 'Forbidden' })
    }
}

module.exports = { middlewareAuth, authRole }