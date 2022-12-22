USE employee_db;

INSERT INTO department (department_name)
VALUES ("Engineering"),
        ("Sales"),
        ("Human Resources"),
        ("Finance"),
        ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 100000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Kaonou", "Her", 1, NULL);