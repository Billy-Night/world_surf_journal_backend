const mysql = require("mysql2");
require("dotenv").config();

console.log("Starting server...");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQLDATABASE,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    process.exit(1);
  } else {
    console.log("Database connected!");
  }
});

module.exports = pool;
