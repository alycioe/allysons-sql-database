// Important imports that will allow the app processes to run properly
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

// Creates server address and creates a const app for express function
const PORT = process.env.PORT || 3306;
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    port: PORT,
    database: 'employer_db',
    user: 'root',
    password: '',
});

connection.connect(err => {
    if (err) {
        console.error('Cannot connect: ', err);
    } else {
        console.log('Connected to MySQL database');
        menu();
    }
});

// Middleware for app
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function menu() {
    inquirer
        .prompt({
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update employee role',
                    'Close program'],
        })
        .then((answer) => {
            switch (answer.options) {

                case "View all departments":
                    viewDepartments();
                    break;

                case "View all roles":
                    viewRoles();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "Add a department":
                    addDepartment();
                    break;

                case "Add a role":
                    addRole();
                    break;

                case "Add an employee":
                    addEmployee();
                    break;

                case "Update an employee":
                    updateEmployee();
                    break;

                case "Close program":
                    connection.end();
                    console.log('Employee tracker closed.')
                    break;
            }
        });
};

function viewDepartments() {
    let selection = 'SELECT * FROM departments';
    connection.query(selection, (err, res) => {
        if (err) {
            console.error('Departments cannot be viewed: ', err);
            menu();
            return;
        }

        console.table(res);
        menu();
    });
}

function viewRoles() {
    let selection = 'SELECT roles.title, roles.id, roles.dep_id, roles.salary FROM roles';
    connection.query(selection, (err, res) => {
        if (err) {
            console.error('Roles cannot be viewed: ', err);
            menu();
            return;
        }

        console.table(res);
        menu();
    })
}

function viewEmployees() {
    let selection = 'SELECT * FROM employees';
    connection.query(selection, (err, res) => {
        if (err) {
            console.error('Cannot view employees: ', err);
            menu();
            return;
        }

        if (res.length === 0) {
            console.log('No employees found.');
        } else {
            console.table(res);
        }

        menu();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'Please enter the name of your new department!',
            name: 'newDepartment'
        })
        .then((answer) => {
            connection.query('INSERT INTO departments SET ?', { dep_name: answer.newDepartment }, (err, res) => {
                if (err) {
                    console.error('Cannot add new department: ', err);
                } else {
                    console.log('Successfully added your department!');               }

                menu();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of your new role?',
                name: 'newRoleTitle'
            },
            {
                type: 'input',
                message: 'What is the salary for this role?',
                name: 'newRoleSalary'
            },
            {
                type: 'input',
                message: 'What is the department ID for this role?',
                name: 'newRoleDepId'
            }
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO roles SET ?',
                {
                    title: answer.newRoleTitle,
                    salary: answer.newRoleSalary,
                    dep_id: answer.newRoleDepId
                },
                (err, res) => {
                    if (err) {
                        console.error('Cannot add role: ', err);
                    } else {
                        console.log('Successfully added role!');
                    }
                    menu();
                }
            );
        });

}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of your new employee?',
                name: 'newEmployeeFirstName'
            },
            {
                type: 'input',
                message: 'What is the last name of your new employee?',
                name: 'newEmployeeLastName'
            },
            {
                type: 'input',
                message: 'What is the role ID for the new employee?',
                name: 'newEmployeeRoleId'
            },
            {
                type: 'input',
                message: 'What is the manager ID for the new employee? (Leave empty if none)',
                name: 'newEmployeeManagerId'
            }
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: answer.newEmployeeFirstName,
                    last_name: answer.newEmployeeLastName,
                    role_id: answer.newEmployeeRoleId,
                    manager_id: answer.newEmployeeManagerId || null
                },
                (err, res) => {
                    if (err) {
                        console.error('Cannot add employee ', err);
                    } else {
                        console.log('Successfully added new employee!');
                    }
                    menu();
                }
            );
        });
}

function updateEmployee() {
    inquirer
        .prompt([
        {
            type: 'input',
            message: 'Which employee would you like to update?',
            name: 'searchEmployee'
        },
        {
            type: 'input',
            message: 'What role are you assigning this employee?',
            name: 'newRole'
        }
        ])
        .then((answer) => {
            connection.query('UPDATE employees SET role_id= ? WHERE first_name= ?', [answer.newRole, answer.searchEmployee], (err, res) => {
                if (err) {
                    console.error('Cannot update employee: ', err);
                } else {
                    console.table(res);
                }

                menu();
            });
        });
}

process.on('Close program', () => {
    connection.end();
});

menu();