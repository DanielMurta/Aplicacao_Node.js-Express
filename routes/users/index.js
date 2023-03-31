const { Router, json } = require('express')
const express = require('express')
const router = express.Router()
const conn = require('../../db/index')
const jwt = require('jsonwebtoken')
const SECRET = 'danieltools'
const middlewareAuth = require('../../auth/index')

router.post('/save', (req, res) => {
    const { firstName, lastName, cpf, birthDate, password_hash, email} = req.body

    
    conn.query(`INSERT INTO users (firstName, lastName, email, cpf, password_hash, birthDate) VALUES (
            '${firstName}', '${lastName}', '${email}', '${cpf}', '${password_hash}', '${birthDate}'
            );`, (err) => {
                if (err) {
                    return res.status(500).send({ error: 'Internal server error' })
                }      
            })

    return res.sendStatus(201)

})

router.post('/login', (req, res) => {
    const { email, password_hash } = req.body

    conn.query(`SELECT * FROM users WHERE email = '${email}';`, (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        const userEmail = data[0].email
        const userHash = data[0].password_hash
        const userId = data[0].id
        
        if (email === userEmail && password_hash === userHash) {
            const token = jwt.sign({ userId: userId }, SECRET, { expiresIn: 300 })
            return res.status(200).json({ auth: true, token})
        } else {
            res.sendStatus(404)
        }
    })
})

router.get('/clients', middlewareAuth, (req, res) => {
    conn.query(`SELECT * FROM users;`, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/:id', (req, res) => {
    const userId = req.params.id
    conn.query(`SELECT * FROM users WHERE id = ${userId};`, (err, data) => {
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

router.delete('/delete/:id', middlewareAuth, (req, res) => {
    const userId = req.params.id
    conn.query(`DELETE FROM users WHERE id = ${userId};`, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Internal server error' })
        } 
    })

    return res.sendStatus(204)
})

router.put('/edit/:id', (req, res) => {
    const userId = req.params.id

    conn.query(`SELECT * FROM users WHERE id = ${userId};`, (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        const user = data[0]
        res.sendFile(`${basePath}/editUser.html`, { user })
    })
})

module.exports = router