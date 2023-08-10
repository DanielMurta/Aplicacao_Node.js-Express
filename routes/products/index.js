const express = require('express')
const router = express.Router()
const path = require('path')
const { middlewareAuth, authRole } = require('../../auth/index')
const conn = require('../../db/index')

router.post('/save', middlewareAuth, authRole, (req, res) => {
    const {name, description, price} = req.body
    const userId = req.userId

    conn.query(`INSERT INTO products (name, description, price, user_id) VALUES (?, ?, ?, ?);`, [name, description, price, userId], 
    (err) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error'})
        }
    })

    return res.sendStatus(201)
})

router.get('/Allproducts', middlewareAuth, authRole, (req, res) => {
    conn.query('SELECT * FROM products;', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/products', (req, res) => {
    const { page = 1, limit = 5} = req.query
    const offset = (page - 1) * limit

    conn.query(`SELECT * FROM products LIMIT ? OFFSET ?;`, [parseInt(limit), parseInt(offset)], (err, data)=> {
        if (err){
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/:id', middlewareAuth, (req, res) => {
    const productId = req.params.id

    conn.query(`SELECT * FROM products WHERE id = ?;`, [productId], (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }

        const product = data[0]

        if (!product) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).json(product)
    })
   
})

router.delete('/delete/:id', middlewareAuth, authRole, (req, res) => {
    const productId = req.params.id

    conn.query(`DELETE FROM products WHERE id = ?`, [productId], (err) => {
        if (err) {
            return res.status(500).send({ error: 'Internal server error' })
        }
    })

    return res.sendStatus(204)
})

router.put('/edit/:id', middlewareAuth, authRole, (req, res)=> {
    const { name, description, price } = req.body
    const productId = req.params.id
    const updates = []
    const queryParams = []
    let query = 'UPDATE products SET '

    if (name) {
        updates.push('name = ?')
        queryParams.push(name)
    }

    if (description) {
        updates.push('description = ?')
        queryParams.push(description)
    }

    if (price) {
        updates.push('price = ?')
        queryParams.push(price)
    }

    query += updates.join(', ') + ' WHERE id = ?'
    queryParams.push(parseInt(productId))
    
    conn.query(query, queryParams, (err, data) => {
        if (err){
            return res.status(500).send({ error: 'Internal server error' })
        }

        if (data.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' })
          }

        return res.sendStatus(200)
    })
})

module.exports = router