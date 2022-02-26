const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const {
  prompts
} = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static('public'))

// Connect to database
const db = mysql.createConnection({
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

const promptMenu = [{
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
}];
const promptAddDept = [{
  type: 'input',
  message: 'What is the name of the Department?',
  name: 'departmentName',
  validate: (value) => {
    if (value) {
      return true
    } else {
      return 'Cannot leave blank'
    }
  },
}];
const promptAddRole = [{
    type: 'input',
    message: 'What is the name of the Role?',
    name: 'roleName',
    validate: (value) => {
      if (value) {
        return true
      } else {
        return 'Cannot leave blank'
      }
    },
  },
  {
    type: 'input',
    message: 'What is the salary of the Role?',
    name: 'roleSalary',
    validate: (value) => {
      if (value) {
        return true
      } else {
        return 'Cannot leave blank'
      }
    },
  },
  {
    type: 'list',
    message: 'Which department does the role belong to?',
    name: 'roleDept',
    choices: []

  }
];
const promptAddEmployee = [{
    type: 'input',
    message: 'What is the employees first name?',
    name: 'employeeFirstName',
    validate: (value) => {
      if (value) {
        return true
      } else {
        return 'Cannot leave blank'
      }
    },
  },
  {
    type: 'input',
    message: 'What is the employees last name?',
    name: 'employeeLastName',
    validate: (value) => {
      if (value) {
        return true
      } else {
        return 'Cannot leave blank'
      }
    },
  },
  {
    type: 'list',
    message: 'What is the role of the employee?',
    name: 'employeeRole',
    choices: []
  },
  {
    type: 'list',
    message: 'Who is the employees Manager?',
    name: 'employeeMngr',
    choices: []
  }
];
const promptUpdateRole = [{
    type: 'list',
    message: 'Which Employee would you like to update?',
    name: 'updateEmployee',
    choices: []
  },
  {
    type: 'list',
    message: 'Which Role would you like to assign the employee?',
    name: 'updateRole',
    choices: []
  }
]

function init() {
  inquirer.prompt(promptMenu)
    .then((data) => {
      if (data.mainMenu === 'View All Employees') {
        viewEmployees()
      } else if (data.mainMenu === 'View All Roles') {
        viewRoles()
      } else if (data.mainMenu === 'View All Departments') {
        viewDepartments()
      } else if (data.mainMenu === 'Add Employee') {
        addEmployee()
      } else if (data.mainMenu === 'Add Role') {
        addRole()
      } else if (data.mainMenu === 'Add Department') {
        addDepartment()
      } else if (data.mainMenu === 'Update Employee Role') {
        updateEmployeeRole()
      } else {

      }
    })
};

function addEmployee() {
  db.query('SELECT title as name, id as value FROM role ORDER BY title', (err, roleData) => {

    db.query('SELECT concat(first_name," ",last_name) AS name, id as value FROM employee ORDER BY last_name', (err, employeeData) => {
      promptAddEmployee[2].choices = roleData;
      promptAddEmployee[3].choices = employeeData;
      inquirer.prompt(promptAddEmployee)
        .then((data) => {
          db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [data.employeeFirstName, data.employeeLastName, data.employeeRole, data.employeeMngr], (err) => {
            if (err) throw err
            viewEmployees()
          })
        })
    })
  })

};

function viewEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    console.table(results)
    init()
  })
}

function viewRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    console.table(results)
    init()
  })
}

function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results)
    init()
  })
}

function addRole() {
  db.query('SELECT name, id as value FROM department ORDER BY name', (err, data) => {
    promptAddRole[2].choices = data
    inquirer.prompt(promptAddRole)
      .then((data) => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES(?,?,?)', [data.roleName, data.roleSalary, data.roleDept], err => {
          if (err) throw err
          viewRoles()
        })
      })
  })

};

function addDepartment() {
  inquirer.prompt(promptAddDept)
    .then((data) => {
      db.query('INSERT INTO department (name) VALUES (?)', [data.departmentName], (err) => {
        if (err) throw err
        viewDepartments()
      })

    })
};

function updateEmployeeRole() {
  db.query('SELECT concat(first_name," ",last_name) AS name, id as value FROM employee ORDER BY last_name', (err, employeeData) => {
    db.query('SELECT title as name, id as value FROM role ORDER BY title', (err, roleData) => {
      promptUpdateRole[0].choices = employeeData;
      promptUpdateRole[1].choices = roleData;
      inquirer.prompt(promptUpdateRole).then(data => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [data.updateEmployee, data.updateRole], (err) => {
          if (err) throw err
          viewEmployees()
        })
      })
    })
  })
}

db.connect(() => {
  init()
})