const express = require('express')
const router = express.Router()
const path = require('path')
const { middlewareAuth, authRole } = require('../../auth/index')
const conn = require('../../db/index')
const basePath = path.join(__dirname, '../../templates')

router.post('/save', middlewareAuth, authRole, (req, res) => {
    const {name, description, price} = req.body
    const userId = req.userId

    conn.query(`INSERT INTO products (name, description, price, user_id) VALUES ('${name}', '${description}', ${price}, ${userId});`, 
    (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Internal server error'})
        }

    })

    return res.sendStatus(201)
})

module.exports = router