const mysql = require("mysql2");
require("dotenv").config();

console.log("Starting server...");

const pool = mysql.createPool({
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  password: process.env.MYSQLPASSWORD,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
});

pool.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    process.exit(1);
  } else {
    console.log("Database connected!");
  }
});

module.exports = pool;
