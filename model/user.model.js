// models/UserModel.js
const sql = require('mssql');
const { encrypt } = require("../utils/bcrypt")
const { sqlConfig } =require("../config")

async function getUserByEmail({ email }) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
}

async function insertUser({ email, full_name, password }) {
  try {

    const hashPassword = encrypt(password)

    console.log(hashPassword, "<< hash password");

    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('full_name', sql.NVarChar, full_name)
      .input('password', sql.NVarChar, hashPassword)
      .query('INSERT INTO SCADA_USER (email, full_name, password) VALUES (@email, @full_name, @password)');

    return result.recordset[0];
  } catch (error) {

    console.log(error, "<< error model");
    throw error;
  }
}

module.exports = {
  getUserByEmail,
  insertUser
};
