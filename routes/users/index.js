const { Router, json } = require('express')
const express = require('express')
const router = express.Router()
const conn = require('../../db/index')

router.post('/save', (req, res) => {
    const FirstName = req.body.firstName
    const LastName = req.body.lastName
    const cpf = req.body.cpf
    const birthDate = req.body.birthDate
    const password_hash = req.body.password_hash
    const email = req.body.email

    
    conn.query(`INSERT INTO users (firstName, lastName, email, cpf, password_hash, birthDate) VALUES (
            '${FirstName}', '${LastName}', '${email}', '${cpf}', '${password_hash}', '${birthDate}'
            )`, (err) => {
                if (err) throw err
                return
            })

    return res.sendStatus(201)

})

router.get('/:id', (req, res) => {
    const userId = req.params.id
    conn.query(`SELECT * FROM users WHERE id = ${userId}`, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Internal server error' })
        }

        const user = data[0]

        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).json(user)
    })

})

router.delete('/delete/:id', (req, res) => {
    const userId = req.params.id
    conn.query(`DELETE FROM users WHERE id = ${userId}`, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Internal server error' })
        } 
    })

    return res.sendStatus(204)
})

router.put('/edit/:id', (req, res) => {
    const userId = req.params.id

    conn.query(`SELECT * FROM users WHERE id = ${userId}`, (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        const user = data[0]
        res.sendFile(`${basePath}/editUser.html`, { user })
    })
})

module.exports = router