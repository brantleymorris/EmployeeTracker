DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL, -- this may need a qualifier
    department_id INT,

    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES (employees)id
);

-- database initiation

-- adds initial departments
INSERT INTO departments (department_name)
VALUES ("engineering"), ("finance"), ("legal"), ("sales");

-- adds initial roles
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1), ("Junior Engineer", 120000, 1), ("Account Manager", 160000, 2), ("Accountant", 125000, 2), ("Legal Team Lead", 250000, 3), ("Lawyer", 180000, 3), ("Sales Lead", 100000, 4), ("Sales Person", 80000, 4);

-- adds initial managers, I think manager_id can be left in since it can be null and is at the end of the string
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ashley", "Rodriguez", 1), ("Kunal", "Singh", 3), ("Sarah", "Lourd", 5), ("John", "Doe", 7);

-- adds initial employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Tupik", 2, 1), ("Malia", "Brown", 4, 2), ("Tom", "Allen", 6, 3), ("Mike", "Chan", 8, 4);



-- querys from server for testing

-- view all employees, works
SELECT *
FROM employees;

-- view all roles, works
SELECT *
FROM roles;

-- view all departments, works
SELECT *
FROM departments;

-- view employees by manager, works, need to change select target
    -- here placeholders (emp, man) need to be assigned to the table since it is self joining
SELECT *
FROM employees emp
LEFT JOIN employees man ON emp.manager_id = man.id
WHERE emp.manager_id = 1; -- value needs to be passed in

-- view employees by department, works, nedd to change select target
SELECT *
FROM departments
INNER JOIN roles ON departments.id = roles.department_id
INNER JOIN employees ON roles.id = employees.role_id
WHERE departments.id = 1; -- value needs to be passed in

-- add employee, WORKS
INSERT INTO employees
VALUES (); -- values will be passed in by query

-- remove employee, WORKS
DELETE FROM employees
WHERE employees.id = (); -- value will be passed in by query

-- update employee role, WORKS
UPDATE employees
SET employees.role_id = () -- id will be passed in by query
WHERE employees.id = (); -- value will be passed in by query

-- update employee manager, WORKS
UPDATE employees
SET employees.manager_id = () -- id will be passed in by query
WHERE employees.id = (); -- value will be passed in by query