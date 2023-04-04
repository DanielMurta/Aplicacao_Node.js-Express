const express = require('express')
const app = express()
const users = require('./routes/users')
const products = require('./routes/products')

// Ler o Body em Json
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

app.use('/user', users)
app.use('/product', products)

app.get('/', (req, res) => {
    res.send('Página Inicial')
})

module.exports = app