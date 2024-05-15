require('dotenv').config()

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SERVER,
  DB_PORT,
  SECRET_KEY,
  PORT
} = process.env

const config = {
  sqlConfig: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    server: DB_SERVER,
    port: Number(DB_PORT),
    pool: {
      max: 10,
      min: 1,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, 
      trustServerCertificate: true
    }
  },
  SECRET_KEY,
  PORT

}

module.exports = config