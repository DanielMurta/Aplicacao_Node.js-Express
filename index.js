const express = require('express')
const app = express()
const path = require('path')
const users = require('./routes/users')
const products = require('./routes/products')

const PORT = 3000

// Ler o Body em Json
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

const basePath = path.join(__dirname, 'templates')

app.use('/user', users)
app.use('/product', products)

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/base.html`)
})

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT} Padrin!`)
})