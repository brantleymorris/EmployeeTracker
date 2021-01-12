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