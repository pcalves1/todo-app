const mysql = require("mysql2/promise")
const fs = require('fs')

const {
  MYSQL_HOST: HOST,
  MYSQL_HOST_FILE: HOST_FILE,
  MYSQL_USER: USER,
  MYSQL_USER_FILE: USER_FILE,
  MYSQL_ROOT_PASSWORD: PASSWORD,
  MYSQL_ROOT_PASSWORD_FILE: PASSWORD_FILE,
  MYSQL_DATABASE: DB,
  MYSQL_DATABASE_FILE: DB_FILE,
} = process.env

const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST
const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER
const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD
const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB

let pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port: 3306,
});

module.exports = pool