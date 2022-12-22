const mysql = require('mysql2');
const inquirer = require('inquirer')

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
  },
);

db.connect(() => {
  console.log(`Connected to the employee_db database.`)
  menuPrompt()
})

const viewDepartments = async () => {
  const sql = 'SELECT * FROM department';
  
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
    } 
    console.log('')
    console.table(data)
    menuPrompt()
  })
} 

const viewRoles = async () => {
  const sql = 'SELECT * FROM role';

  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.table(data)
    menuPrompt()
  })
}

const viewEmployees = async () => {
  const sql = 'SELECT * FROM employee';

  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.table(data)
    menuPrompt()
  })
}

const addDepartment = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'department_name',
      message: 'What department would you like to add?'
  }])
  
  console.log(answer.department_name)
  const sql = `INSERT INTO department (department_name) VALUES (?)`;
  
  db.query(sql, answer.department_name, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log('Department has been added')
    menuPrompt()
  })
}

const addRole = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of this new role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this role?'
    },
    {
      type: 'number',
      name: 'department_id',
      message: 'What department will this role be in? Please enter department ID.'
    }
  ])

  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

  db.query(sql, [answer.title, answer.salary, answer.department_id], (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log('Role has been added')
    menuPrompt()
  })
}

const addEmployee = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of this new employee?'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of this new employee?'
    },
    {
      type: 'number',
      name: 'role_id',
      message: 'What is the role for this new employee? Please enter role_id.'
    },
    {
      type: 'number',
      name: 'manager_id',
      message: 'Is this employee a manager? If so, please enter an id. If not, please enter NULL.'
    }
  ])

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

  db.query(sql, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log('Employee has been added')
    menuPrompt()
  })
}

const updateEmployeeRole = async () => {
  const sql = `SELECT * FROM employee`

  db.query(sql, async (err, data) => {
    if (err) {
      console.log(err);
    }
  
    const employeeList = []

   for (let i = 0; i < data.length; i++) {
      employeeList.push(`${data[i].id}`)
   }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select the employee you would like to update',
        choices: employeeList
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'What is the updated role id?',
      }
    ])
  
    const updateSql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [answer.role_id, answer.employee]

    db.query(updateSql, params, (err, result) => {
      if (err) {
        console.log(err);
      } 
      console.log('Role has been updated!')  
    });
  })
  
  menuPrompt()
}

// const deleteMenu = async () => {
//   const answer = await inquirer.prompt([
//       {
//           type: 'list',
//           name: 'action',
//           message: 'What would you like to delete?'
//           choices: ['department', 'employee', 'role']
//       },
//       {
//           type: 'input',
//           name: 'first_name',
//           message: 'Update first name',
//           default: async (sessionAnswers) => {
//               const [results] = await connection.promise().query(
//                   'Select first_name from actor where actor_id = ?',
//                   sessionAnswers.actor_id)
//           }
//           return results[0].first_name
//       },
//       {
//           type: 'input',
//           name: 'last_name',
//           message: 'Update last name'
//       }
//   ])
// }

const menuPrompt = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'what do you want to do?',
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    }
  ])

  console.log(answers)
  if (answers.action === 'view all departments') {
    viewDepartments()
  } else if (answers.action === 'view all roles') {
    viewRoles()
  } else if (answers.action === 'view all employees') {
    viewEmployees()
  } else if (answers.action === 'add a department') {
    addDepartment()
  } else if (answers.action === 'add a role') {
    addRole()
  } else if (answers.action === 'add an employee') {
    addEmployee()
  } else if (answers.action === 'update an employee role') {
    updateEmployeeRole()
  } 
  // else if (answers.action === 'delete') {
  //   deleteMenu()
  // }
    else {
    process.exit(0)
  }
}

