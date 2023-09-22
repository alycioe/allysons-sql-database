INSERT INTO departments (dep_name)
VALUES ('Executive'), ('Manager'), ('Human Resources'), ('Marketing Specialist'),
('Accounting Specialist'), ('Sales Representative');

INSERT INTO roles (title, salary, dep_id)
VALUES ('CEO', 150000.00, 1), ('Marketing Manager', 100000.00, 2), ('Accounting Manager', 95000.00, 2),
('Sales Manager', 90000.00, 2), ('HR Coordinator', 85000.00, 3), ('Marketing Researcher', 65000, 4), ('Communications', 65000, 4),
('Accountant', 60000, 5), ('Customer Service Rep', 30000.00, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Johnny', 'Appleseed', 1, 1), ('Dwayne', 'Johnson', 2, 4), ('Barack', 'Obama', 2, 2), ('Ashley', 'Tisdale', 2, 3),
('Ash', 'Ketchum', 3, 5), ('Freddie', 'Kruegar', 4, 6), ('Betty', 'White', 4, 7), ('George', 'George', 5, 8), ('Frank', 'Sauce', 5, 8),
('Saint', 'Lewis', 6, 9), ('Kris', 'Jenner', 6, 9);