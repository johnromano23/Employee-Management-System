const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");
const logo = require("asciiart-logo");

init();

function init() {
  const logoText = logo({ name: "Employee Management System" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add Role",
          value: "ADD_ROLE",
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
    },
  ]);

  switch (choice) {
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();

    default:
      return quit();
  }
}

async function viewDepartments() {
  const YOUR_VARIABLE = await db.findAllDepartments();

  console.log("\n");
  console.table(YOUR_VARIABLE);

  loadMainPrompts();
}

async function addDepartment() {
  const YOUR_DEPT_VARIABLE = await prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]);
  await db.createDepartment(YOUR_DEPT_VARIABLE);

  console.log("Added " + YOUR_DEPT_VARIABLE + " to the database");

  loadMainPrompts();
}

async function viewRoles() {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  loadMainPrompts();
}

async function addRole() {
  const YOUR_DEPT_VAR = await db.findAllDepartments();

  const YOUR_DEPT_CHOICES = YOUR_DEPT_VAR.map(({ id, name }) => ({
    name: name,
    value: id,
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?",
    },
    {
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: YOUR_DEPT_CHOICES,
    },
  ]);

  await db.createRole(role);

  console.log(`Added ${role.title} to the database`);

  loadMainPrompts();
}

async function viewEmployees() {
  const YOUR_EMP_VAR = await db.findAllEmployees();
  console.log("\n");
  console.table(YOUR_EMP_VAR);
  loadMainPrompts();
}

async function updateEmployeeRole() {
  const YOUR_EMP_VAR = await db.findAllEmployees();
  const YOUR_EMP_CHOICES = YOUR_EMP_VAR.map(
    ({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
  );
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "YOUR_QUESTION",
      choices: YOUR_EMP_CHOICES,
    },
  ]);
  const YOUR_ROLES_VAR = await db.findAllRoles();
  const YOUR_ROLE_CHOICES = YOUR_ROLES_VAR.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "YOUR_QUESTION_FOR_ROLE",
      choices: YOUR_ROLE_CHOICES,
    },
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

async function addEmployee() {
  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);

  const YOUR_ROLES_VAR = await db.findAllRoles();

  const YOUR_ROLE_CHOICES = YOUR_ROLES_VAR.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const role = await prompt([
    {
      type: "list",
      name: "roleId",
      choices: YOUR_ROLE_CHOICES,
    },
  ]);

  employee.role_id = role.roleId;

  const YOUR_MANAGER_VAR = await db.findAllManagers();

  const YOUR_MANAGER_CHOICES = YOUR_MANAGER_VAR.map(
    ({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const manager = await prompt([
    {
      type: "list",
      name: "managerId",
      choices: YOUR_MANAGER_CHOICES,
    },
  ]);

  employee.manager_id = manager.managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
