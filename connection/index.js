const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

module.exports = connection;