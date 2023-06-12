import mysql from "mysql";

export const db = mysql.createPool({
  connectionLimit: 100,
  waitForConnections: true,
  queueLimit: 0,
  connectionLimit: 10,
  host: "db",
  user: "root",
  password: process.env.PASSWORD,
  database: "sm_app",
  debug: false,
  debug: true,
  wait_timeout: 28800,
  connect_timeout: 10,
});
