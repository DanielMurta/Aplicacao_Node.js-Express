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

router.get('/products', middlewareAuth, (req, res) => {
    const { page = 1, limit = 5} = req.query
    const offset = (page - 1) * limit

    conn.query(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset};`, (err, data)=> {
        if (err){
            return res.status(500).send({ error: 'Internal server error' })
        }

        return res.status(200).json(data)
    })
})

router.get('/:id', middlewareAuth, authRole, (req, res) => {
    const productId = req.params.id

    conn.query(`SELECT * FROM products WHERE id = ${productId};`, (err, data) => {
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
    const productId = req.params.id

    conn.query(`DELETE FROM products WHERE id = ${productId};`, (err) => {
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

    if (name) {
        updates.push(`name = '${name}'`)
    }

    if (description) {
        updates.push(`description = '${description}'`)
    }

    if (price) {
        updates.push(`price = '${price}'`)
    }

    conn.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ${productId};`, (err, data) => {
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