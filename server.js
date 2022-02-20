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
app.listen(PORT);

// const allDepartments = [];
// const allRoles = [];
// const allEmployees = [];

// db.query('SELECT name FROM department', function (err, results) {
//   allDepartments.push(results)
//   console.log(allDepartments);
// })

const promptMenu = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'mainMenu',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit'
    ]
  }
];
const promptAddDept = [
  {
    type: 'input',
    message: 'What is the name of the Department?',
    name: 'departmentName',
    validate: (value) => { if (value) {return true} else {return 'Cannot leave blank'}},
  }
];
const promptAddRole = [
  {
    type: 'input',
    message: 'What is the name of the Role?',
    name: 'roleName',
    validate: (value) => { if (value) {return true} else {return 'Cannot leave blank'}},
  },
  {
    type: 'input',
    message: 'What is the salary of the Role?',
    name: 'roleSalary',
    validate: (value) => { if (value) {return true} else {return 'Cannot leave blank'}},
  },
  {
    type: 'list',
    message: 'Which department does the role belong to?',
    name: 'roleDept',
    choices: [
     
    ]

  }
];
const promptAddEmployee = [
  {
    type: 'input',
    message: 'What is the employees first name?',
    name: 'employeeFirstName',
    validate: (value) => { if (value) {return true} else {return 'Cannot leave blank'}},
  },
  {
    type: 'input',
    message: 'What is the employees last name?',
    name: 'employeeLastName',
    validate: (value) => { if (value) {return true} else {return 'Cannot leave blank'}},
  },
  {
    type: 'list',
    message: 'What is the employees role of the employee?',
    name: 'employeeRole',
    choices: [

    ]


  }

];

function init() {
  inquirer.prompt(promptMenu)
    .then((data) => {
      if (data.mainMenu === 'View All Employees') {
        db.query('SELECT * FROM employee', function (err, results) {
          console.table(results)
        })
        init()
      }
      else if (data.mainMenu === 'View All Roles') {
        db.query('SELECT * FROM role', function (err, results) {
          console.table(results)
        })
        init()
      }
      else if (data.mainMenu === 'View All Departments') {
        db.query('SELECT * FROM department', function (err, results) {
          console.table(results)
        })
        init()
      }
      else if (data.mainMenu === 'Add Employee') {
        addEmployee()
      }
      else if (data.mainMenu === 'Add Role') {
        addRole()
      }
      else if (data.mainMenu === 'Add Department') {
        addDepartment()
      }
    })
};

function addEmployee() {
  inquirer.prompt(promptAddEmployee)
    .then((data) => {

    })
};

function addRole() {
  inquirer.prompt(promptAddRole)
  .then((data) => {

  })
};

function addDepartment() {
  inquirer.prompt(promptAddDept)
  .then((data) => {

  })
};

init()