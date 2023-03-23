const express = require('express')
const router = express.Router()
const path = require('path')

const basePath = path.join(__dirname, '../../templates')

router.get('/:id', (req, res) => {
    const productId = req.params.id
    console.log(`Produto com id ${productId}`)
    res.send('Pagina produtos')
})

module.exports = router