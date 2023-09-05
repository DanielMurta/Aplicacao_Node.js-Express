const { Router, json } = require('express')
const express = require('express')
const router = express.Router()
const conn = require('../../db/index')
const { generateToken, middlewareAuth, authRole } = require('../../auth/index')

router.post('/save', async (req, res) => {
    const { firstName, lastName, cpf, birthDate, password_hash, email} = req.body

    
    conn.query(`INSERT INTO users (firstName, lastName, email, cpf, password_hash, birthDate) VALUES (?, ?, ?, ?, ?, ?);`, 
    [firstName, lastName, email, cpf, password_hash, birthDate], (err) => {
                if (err) {
                    return res.status(500).send({ error: 'Internal server error' })
                }      
            })

    return res.sendStatus(201)
})

router.post('/login', (req, res) => {
    const { email, password_hash } = req.body

    conn.query(`SELECT * FROM users WHERE email = ?;`, [email], (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        const userEmail = data[0].email
        const userHash = data[0].password_hash
        const userId = data[0].id
        const userRole = data[0].role
        
        if (email === userEmail && password_hash === userHash) {
            const token = generateToken({ userId: userId, role: userRole })
            return res.status(200).json({ auth: true, token})
        } else {
            res.sendStatus(404)
        }
    })
})

router.post('/:Userid/product', middlewareAuth, (req, res) => {
    const {name, description, price} = req.body
    const userId = req.params.Userid

    conn.query(`INSERT INTO products (name, description, price, user_id) VALUES (?, ?, ?, ?);`, [name, description, price, userId],
    (err) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error'})
        }
    })

    return res.sendStatus(201)
})

router.get('/clients', middlewareAuth, authRole, (req, res) => {
    conn.query(`SELECT * FROM users;`, (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/users', middlewareAuth, (req, res) => {
    const { limit = 5, page = 1 } = req.query
    const offset = (page - 1) * limit
    
    conn.query(`SELECT * FROM users LIMIT ? OFFSET ?;`, [parseInt(limit), offset], (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/:id', middlewareAuth, (req, res) => {
    const userId = req.params.id
    conn.query(`SELECT * FROM users WHERE id = ?;`, [userId] , (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        const user = data[0]

        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).json(user)
    })

})

router.get('/:Userid/Allproducts', middlewareAuth, (req, res)=> {
    const userId = req.params.Userid

    conn.query(`SELECT * FROM products WHERE user_id = ?;`, [userId], (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        if (!data[0]) {
            return res.status(404).send({ error: 'Product Not Found'})
        }

        return res.status(200).json(data)
    })
})


router.delete('/delete/:id', middlewareAuth, authRole, (req, res) => {
    const userId = req.params.id
    conn.query(`DELETE FROM users WHERE id = ?;`, [userId], (err) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        } 
    })

    return res.sendStatus(204)
})

router.put('/edit/:id', middlewareAuth, (req, res) => {
    const userId = req.params.id
    const { firstName, lastName, email, cpf, password_hash, birthDate } = req.body
    const updates = []
    const queryParams = []
    let query = 'UPDATE users SET '

    if (firstName) {
        updates.push('firstName = ?')
        queryParams.push(firstName)
    }

    if (lastName) {
        updates.push('lastName = ?')
        queryParams.push(lastName)
    }

    if (email) {
        updates.push('email = ?')
        queryParams.push(email)
    }

    if (cpf) {
        updates.push('cpf = ?')
        queryParams.push(cpf)
    }

    if (password_hash) {
        updates.push('password_hash = ?')
        queryParams.push(password_hash)
    }

    if (birthDate) {
        updates.push('birthDate = ?')
        queryParams.push(birthDate)
    }

    query += updates.join(', ') + ' WHERE id = ?'
    queryParams.push(parseInt(userId))

    conn.query(query, queryParams, (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        if (data.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' })
          }

        return res.status(200).json(data)
    })
})

router.put('/editRole/:id', middlewareAuth, authRole, (req, res) => {
    const userId = req.params.id 

    conn.query(`UPDATE users SET role = 'admin' WHERE id = ?`, [userId], (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        if (data.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).json(data)
    })
})

module.exports = router