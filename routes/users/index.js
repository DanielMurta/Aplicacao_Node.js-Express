const { Router } = require('express')
const express = require('express')
const router = express.Router()
const path = require('path')
const conn = require('../../db/index')

const basePath = path.join(__dirname, '../../templates')

router.get('/add', (req, res) => {
    res.sendFile(`${basePath}/userForm.html`)
})

router.post('/save', (req, res) => {
    const FirstName = req.body.firstName
    const LastName = req.body.lastName
    const cpf = req.body.cpf
    const birthDate = req.body.birthDate

    
    conn.query(`INSERT INTO users (firstName, lastName, cpf, birthDate) VALUES (
            '${FirstName}', '${LastName}', '${cpf}', '${birthDate}'
            )`, (err) => {
                if (err) throw err
                return
            })

    return res.status(201).sendFile(`${basePath}/userForm.html`)

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

        return res.status(200).send({ user })
    })

})

router.get('/delete/:id', (req, res) => {
    const userId = req.params.id
    console.log(userId)
    conn.query(`DELETE FROM users WHERE id = ${userId}`, (err) => {
        if (err) {
            console.log(err)
        } 
            
        res.send('Usuário Excluído')
    })
})

router.get('/edit/:id', (req, res) => {
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