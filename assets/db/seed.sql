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