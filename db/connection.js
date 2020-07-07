const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_KEY,
  database: "employees",
});

connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;
