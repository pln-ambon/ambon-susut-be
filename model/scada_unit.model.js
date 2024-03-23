const sql = require('mssql');

async function getAllScadaUnit() {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .query('SELECT * FROM SCADA_UNIT');

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllScadaUnit
}
