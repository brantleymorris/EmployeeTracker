const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeDB"
});

connection.connect(function(err) {
    if (err) throw err; console.log("connected as id " + connection.threadId + "\n");

    beginProgram();
});


// Functions to start program
    //
    function ask() {
        return inquirer
        .prompt({
            // add initial question
            name: "action",
            type: "rawlist",
            message: "What would you like to do? \n (use the arrow keys to scroll up and down)",
            choices: ["View all employees", "View roles", "View departments", "View all employees by department", "View all employees by manager", "Add employee", "Add role", "Add department", "Remove employee", "Remove role", "Remove department", "Update employee role", "Update employee manager", "Exit program"] // this will be the array that holds initial options, may define outside of function and pass in
        });
    };

    // starting function
    function beginProgram() {
        // inquirer
        //     .prompt({
        //         // add initial question
        //         name: "action",
        //         type: "rawlist",
        //         message: "What would you like to do? \n (use the arrow keys to scroll up and down)",
        //         choices: ["View all employees", "View roles", "View departments", "View all employees by department", "View all employees by manager", "Add employee", "Add role", "Add department", "Remove employee", "Remove role", "Remove department", "Update employee role", "Update employee manager", "Exit program"] // this will be the array that holds initial options, may define outside of function and pass in
        //     })
            ask().then(function (answers) {
                // switch statements to select next function to run
                switch (answers.action) {
                    case ("View all employees"):
                        viewEmployees();
                        break;
                    case ("View all employees by department"):
                        viewByDepartment(); 
                        break;
                    case ("View all employees by manager"):
                        viewByManager();
                        break;
                    case ("View roles"):
                        viewRoles();
                        break;
                    case ("View departments"):
                        viewDepartments();
                        break;
                    case ("Add employee"):
                        addEmployee();
                        break;
                    case ("Add role"):
                        addRole();
                        break;
                    case ("Add department"):
                        addDepartment();
                        break;
                    case ("Remove employee"):
                        removeEmployee();
                        break;
                    case ("Remove role"):
                        removeRole();
                        break;
                    case ("Remove department"):
                        removeDepartmnet();
                        break;
                    case ("Update employee role"):
                        updateRole();
                        break;
                    case ("Update employee manager"):
                        updateManager();
                        break;
                    default: 
                        console.log("Good bye")
                        connection.end();
                }
            });
    };

// expand to view inquirer questions
    // add departments
    function addDepartment() {
        inquirer 
            .prompt({
                name: "department",
                type: "input",
                message: "What department would you like to add?"
            })
            .then(function(answer) {
                let query = "INSERT INTO departments (department_name) VALUE ?;";
                connection.query(query, {name: answer.department}, function (err) {
                    if (err) throw err;
                });
            });
    };

    // add roles
    function addRole () {
        let departmentsNames = [];
        let departmentId= [];

        connection.query("SELECT * FROM departments", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departmentsNames.push(res[i].department);
                departmentId.push(res[i].id);
            }
        
            inquirer
                .prompt({
                    name: "title",
                    type: "input",
                    message: "What role would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is this roles starting salary?"
                },
                {
                    name: "departmentName",
                    type: "rawlist",
                    message: "Which department does this role fall under?",
                    choices: departmentsNames
                })
                .then(function(answers) {
                    for (let j = 0; j < departmentsNames.length; j++) {
                        if (answers.departmentName === departmentsNames[j]) {
                            var selectedID = departmentId[j];
                        }
                    }
                    let query = "INSERT INTO roles (title, salary, department_id) VALUE (?, ?, ?);";
                    connection.query(query, [{title: answers.title}, {salary: answers.salary}, {department_id: selectedID}], function (err) {
                        if (err) throw err;
                        beginProgram();
                    });
                });
            })
    };

    // add employees
    function addEmployee () {

        connection.query("SELECT * FROM roles", function (err, res) {
            let rolesNames = [];
            let rolesID = [];

            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                rolesNames.push(res[i].title);
                rolesID.push(res[i].role_id);
            }

            connection.query("SELECT * FROM employees", function (err, res) {
                let managersArray = [];
                let managersID = [];
    
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].manager_id === "NULL") {
                        managersArray.push(res[i].first_name);
                        managersID.push(res[i].id);
                    }
                }

                inquirer
                    .prompt({
                        name: "firstName",
                        type: "input",
                        message: "What is the employees first name?"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employees last name?"
                    },
                    {
                        name: "role",
                        type: "rawlist",
                        message: "What is the employees role?",
                        choices: rolesNames
                    },
                    {
                        name: "manager",
                        type: "rawlist",
                        message: "Who is this employees manager",
                        choices: managersArray
                    })
                    .then(function(answers) {
                        for (let j = 0; j < rolesNames.length; j++) {
                            if (answers.role === rolesNames[j]) {
                                var roleID = rolesID[j];
                            }
                        }

                        for (let j = 0; j < managersArray.length; j++) {
                            if (answers.manager === managersArray[j]) {
                                var managerID = managersID[j];
                            }
                        }
                        
                        let query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?);";
                        connection.query(query, [answers.firstName, answers.lastName, roleID, managerID], function (err) { 
                            if (err) throw err;
                            beginProgram();
                        });
                    });
                
            })
        })
    };

    // view employees by manager
    function viewByManager() {

        connection.query("SELECT * FROM employees", function (err, res) {
            let managersArray = [];
            let managerID = [];

            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                if (res[i].manager_id === "NULL") {
                    managersArray.push(res[i].first_name);
                    managerID.push(res[i].id);
                }
            }

            inquirer
                .prompt({
                    name: "manager",
                    type: "rawlist",
                    message: "Whos employees would like to view?",
                    choices: managersArray 
                })
                .then(function(answers) {
                    for (let j = 0; j < managersArray.length; j++) {
                        if (answers.manager === managersArray[j]) {
                            var managerID = managersID[j];
                        }
                    }
                    connection.query("SELECT * FROM employees emp LEFT JOIN employees man ON emp.manager_id = man.id WHERE emp.manager_id = ?;", managerID, function (err, res) {
                        console.table(res);
                        beginProgram();
                });
            });
        })
    };

    // view employees by department
    function viewByDepartment() {

        connection.query("SELECT * FROM departments", function (err, res) {
            let departmentsArray = [];
            let departmentsID = [];

            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departmentsArray.push(res[i].department_name);
                departmentsID.push(res[i].id);
            }

            inquirer
                .prompt({
                    name: "department",
                    type: "rawlist",
                    message: "Which department's employees would you like to view?",
                    choices: [departmentsArray] 
                })
                .then(function(answers) {
                    for (let j = 0; j < departmentsNames.length; j++) {
                        if (answers.departmentName === departmentsNames[j]) {
                            var selectedID = departmentId[j];
                        }
                    }
                    connection.query("SELECT * FROM departments INNER JOIN roles ON departments.id = roles.department_id INNER JOIN employees ON roles.id = employees.role_id WHERE departments.id = ?;", selectedID, function (err, res) {
                        console.table(res);
                        beginProgram();
                });
            });
        });
    };

    // remove employee
    function removeEmployee() {
        connection.query("SELECT * FROM employees", function (err, res) {
            let employeesArray = [];

            for (let i = 0; i < res.length; i++) {
                employeesArray.push(res[i].first_name);
            }

            inquirer
                .prompt({
                    name: "employee",
                    type: "rawlist",
                    message: "Which employee would you like to remove?",
                    choices: employeesArray
                })
                .then(function(answers) {
                    connection.query("DELETE FROM employees WHERE employees.first_name = ?;", answer.employee, function (err, res) {
                        console.log(answers.employee + "has been removed.");
                        beginProgram();
                    });

                });
        })
    };

    // remove role
    function removeRole() {

        connection.query("SELECT * FROM roles", function (err, res) {
            let rolesArray = [];

            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            }

            inquirer
                .prompt({
                    name: "role",
                    type: "rawlist",
                    message: "Which role would you like to remove?",
                    choices: rolesArray
                })
                .then(function(answers) {
                    connection.query("DELETE FROM roles WHERE roles.title = ?;", answers.role, function (err, res) {
                        console.log(answers.role + "has been removed.")
                    });
                beginProgram();
                });
        })
    };

    // remove department
    function removeDepartmnet() {
        
        connection.query("SELECT * FROM departments", function (err, res) {
            let departmentsArray = [];
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departmentsArray.push(res[i].department_name);
            }
        
            inquirer
                .prompt({
                    name: "department",
                    type: "rawlist",
                    message: "Which department would you like to remove?",
                    choices: departmentsArray
                })
                .then(function(answers) {
                    connection.query("DELETE FROM departments WHERE departments.department_name = ?;", answers.department, function (err, res) {
                        console.log(answers.department + "has been removed.");
                        beginProgram();
                    });
                });
        })
    };

    // update employee role
    function updateRole() {
        
        connection.query("SELECT * FROM employees", function (err, res) {
            let employeesArray = [];
            let rolesArray = [];

            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                employeesArray.push(res[i].first_name);
            }
        
            connection.query("SELECT * FROM roles", function (err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    rolesArray.push(res[i].title)
                }
            
                inquirer
                    .prompt({
                        name: "employee",
                        type: "rawlist",
                        message: "Which employee's role would you like to change?",
                        choices: employeesArray
                    },
                    {
                        name: "newRole",
                        type: "rawlist",
                        message: "What is their new role?",
                        choices: rolesArray
                    })
                    .then(function(answers) {
                        connection.query("UPDATE employees SET employees.role_id = ? WHERE employees.first_name = ?", [{employee_roleID: answers.newRole}, {employee_ID: answers.employee}], function (err, res) {
                            console.log(answers.employee + "'s role has been updated.");
                            beginProgram();
                        });
                    });
            })
        })
    };

    // update employee manager
    function updateManager() {
        inquirer
            .prompt({
                name: "employee",
                type: "rawlist",
                message: "Which employee's manager would you like to change?",
                choices: []
            },
            {
                name: "newManager",
                type: "rawlist",
                message: "Who is their new manager?",
                choices: []
            })
            .then(function(answers) {
                connection.query("UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?", [{employee_managerID: answers.newManager}, {employee_ID: answers.employee}], function (err, res) {
                    console.log(answers.employee + "'s manager has been updated.");
                    beginProgram();
                });
            });
    };

// these queries do not require inquirer
    // view departments
    function viewDepartments() {
        connection.query("SELECT * FROM departments", function (err, res) {
            console.table(res);
            beginProgram();
        });
    };

    // function to view roles
    function viewRoles() {
        connection.query("SELECT * FROM roles", function (err, res) {
            console.table(res);
            beginProgram();
        });
    };

    // function to view employees
    function viewEmployees() {
        connection.query("SELECT * FROM employees", function (err, res) {
            console.table(res);
            beginProgram();
        });
    };
