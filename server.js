const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('./connection');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'management_db'
  },
  console.log(`Connected to the management_db database.`)
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

inquirer.prompt
// // Query database
db.query('SELECT * FROM employee', function (err, results) {
  console.table(results);
});






