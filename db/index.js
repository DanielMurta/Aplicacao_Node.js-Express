const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'daniel12345678910',
    database: 'marketplace'
})

module.exports = pool