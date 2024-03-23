const sql = require('mssql');
const { sqlConfig } =require("../config")

async function getAllScadaUnit() {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .query('SELECT * FROM SCADA_UNIT');

    console.log(result, "<< result");

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllScadaUnit
}
