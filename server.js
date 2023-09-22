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
            switch (answer.action) {

                case "View all departments":
                    viewDepartments();
                    

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
        if (err) throw err;
        console.table(res);
        menu();
    });
}

function viewRoles() {
    let selection = 'SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles';
    connection.query(selection, (err, res) => {
        if (err) throw (err);
        console.table(res);
        menu();
    })
}

function viewEmployees() {
    
}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployee() {
    inquirer
        .createPromptModule([
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
            connection.query('UPDATE employee SET role_id= ? WHERE first_name= ?', [answer.newRole, answer.searchEmployee], (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
            });
        });
}

process.on('Close program', () => {
    connection.end();
});

menu();