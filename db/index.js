const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  findAllDepartments() {
    return this.connection.query("SELECT * FROM department");
  }
  createDepartment(department) {
    this.connection.query(
      "INSERT INTO department SET ?",
      {
        name: department.name,
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    return;
  }
  findAllRoles() {
    return this.connection.query("SELECT * FROM role");
  }

  createRole(role) {
    {
      this.connection.query(
        "INSERT INTO role SET ?",
        {
          title: role.title,
          salary: role.salary,
          department_id: role.department_id,
        },
        function (err, res) {
          if (err) throw err;
        }
      );
      return;
    }
  }
  findAllEmployees() {
    return this.connection.query("SELECT * FROM employee");
  }
  findManagerRole() {
    return this.connection.query(
      "SELECT employee.manager_id, role.title FROM employee INNER JOIN role ON employee.role_id = role.id"
    );
  }
  createEmployee(employee) {
    this.connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: employee.first_name,
        last_name: employee.last_name,
        role_id: employee.role_id,
        manager_id: employee.manager_id,
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    return;
  }
  updateEmployeeRoleDB(employeeId, roleId) {
    this.connection.query(
      "UPDATE employee SET role_id='?' WHERE id='?'",
      [roleId, employeeId],
      function (err, res) {
        if (err) throw err;
      }
    );
    return;
  }
}

module.exports = new DB(connection);
