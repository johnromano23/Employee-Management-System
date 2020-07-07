const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

init();

function init() {
  const intro = `
███████ ███    ███ ██████  ██       ██████  ██    ██ ███████ ███████     
██      ████  ████ ██   ██ ██      ██    ██  ██  ██  ██      ██          
█████   ██ ████ ██ ██████  ██      ██    ██   ████   █████   █████       
██      ██  ██  ██ ██      ██      ██    ██    ██    ██      ██          
███████ ██      ██ ██      ███████  ██████     ██    ███████ ███████     
                                                                         
                                                                         
████████ ██████   █████   ██████ ██   ██ ███████ ██████                  
   ██    ██   ██ ██   ██ ██      ██  ██  ██      ██   ██                 
   ██    ██████  ███████ ██      █████   █████   ██████                  
   ██    ██   ██ ██   ██ ██      ██  ██  ██      ██   ██                 
   ██    ██   ██ ██   ██  ██████ ██   ██ ███████ ██   ██ 
      
 `;
  console.log(intro);

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
  const departments = await db.findAllDepartments();
  let deptArrayHolder = [];
  for (let i = 0; i < departments.length; i++) {
    let deptArray = [departments[i].id, departments[i].name];
    deptArrayHolder.push(deptArray);
  }
  console.log("------------------------------------------------------");
  console.log("DEPARTMENTS");
  console.log("------------------------------------------------------");
  console.table(["ID", "Name"], deptArrayHolder);
  console.log("\n");

  loadMainPrompts();
}

async function addDepartment() {
  const deptTemplate = await prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]);
  await db.createDepartment(deptTemplate);
  console.log("Added " + deptTemplate.name + " to the database");
  console.log("\n");

  loadMainPrompts();
}

async function viewRoles() {
  const roles = await db.findAllRoles();
  let roleArrayHolder = [];
  for (let i = 0; i < roles.length; i++) {
    let roleArray = [
      roles[i].id,
      roles[i].title,
      roles[i].salary,
      roles[i].department_id,
    ];
    roleArrayHolder.push(roleArray);
  }
  console.log("------------------------------------------------------");
  console.log("EMPLOYEE ROLES");
  console.log("------------------------------------------------------");
  console.table(
    ["Role ID", "Title", "Salary", "Derpartment ID"],
    roleArrayHolder
  );
  console.log("\n");
  loadMainPrompts();
}
async function addRole() {
  const allDepartments = await db.findAllDepartments();
  const deptChoices = allDepartments.map(({ id, name }) => ({
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
      choices: deptChoices,
    },
  ]);
  await db.createRole(role);
  console.log(`Added ${role.title} to the database`);
  console.log("\n");
  loadMainPrompts();
}
async function viewEmployees() {
  const employees = await db.findAllEmployees();
  let employeesArrayHolder = [];

  for (let i = 0; i < employees.length; i++) {
    let employeeArray = [
      employees[i].id,
      employees[i].first_name,
      employees[i].last_name,
      employees[i].role_id,
      employees[i].manager_id,
    ];
    employeesArrayHolder.push(employeeArray);
  }
  console.log("------------------------------------------------------");
  console.log("EMPLOYEES");
  console.log("------------------------------------------------------");
  console.table(
    ["ID", "First Name", "Last Name", "Role ID", "Manager ID"],
    employeesArrayHolder
  );
  console.log("\n");

  loadMainPrompts();
}
async function updateEmployeeRole() {
  const updateEmployee = await db.findAllEmployees();

  const updateEmployeeChoices = updateEmployee.map(
    ({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
  );
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Who do you want to update?",
      choices: updateEmployeeChoices,
    },
  ]);
  const updateRole = await db.findAllRoles();
  const updateRoleChoices = updateRole.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What role would you like to assign?",
      choices: updateRoleChoices,
    },
  ]);
  const employeeInt = parseInt(employeeId);
  const roleInt = parseInt(roleId);
  const data = await db.updateEmployeeRoleDB(employeeInt, roleInt);
  console.log("Updated employee's role");
  console.log("\n");

  loadMainPrompts();
}
async function addEmployee() {
  const employeeTemplate = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);
  const getAllRoles = await db.findAllRoles();
  let roleArrayHolder = [];

  for (let i = 0; i < getAllRoles.length; i++) {
    let roleArray = [
      getAllRoles[i].id,
      getAllRoles[i].title,
      getAllRoles[i].salary,
      getAllRoles[i].department_id,
    ];
    roleArrayHolder.push(roleArray);
  }
  console.log("\n");
  console.log("------------------------------------------------------");
  console.log("EMPLOYEE ROLES");
  console.log("------------------------------------------------------");
  console.table(
    ["Role ID", "Title", "Salary", "Derpartment ID"],
    roleArrayHolder
  );
  console.log("\n");
  const roleQuery = await prompt([
    {
      name: "roleId",
      message:
        "What is the employee's role id? All employee roles are listed above as reference.",
    },
  ]);
  const getAllManagers = await db.findManagerRole();
  let managerArrayHolder = [];

  for (let i = 0; i < getAllManagers.length; i++) {
    let managerArray = [getAllManagers[i].manager_id, getAllManagers[i].title];
    managerArrayHolder.push(managerArray);
  }

  console.log("\n");
  console.log("------------------------------------------------------");
  console.log("MANAGER IDs");
  console.log("------------------------------------------------------");
  console.table(["Manager ID", "Employee Role Title"], managerArrayHolder);
  console.log("\n");

  const managerQuery = await prompt([
    {
      name: "managerId",
      message:
        "What is the id of the employee's manager? All manager ids are listed above as reference.",
    },
  ]);
  const roleID = parseInt(roleQuery.roleId);
  const managerID = parseInt(managerQuery.managerId);
  const employee = {
    first_name: employeeTemplate.first_name,
    last_name: employeeTemplate.last_name,
    role_id: roleID,
    manager_id: managerID,
  };

  await db.createEmployee(employee);
  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );
  console.log("\n");
  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
