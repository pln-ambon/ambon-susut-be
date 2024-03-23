const sql = require('mssql');
const { sqlConfig } =require("../config")

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

async function getAllScadaUnitMeter() {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .query(`
      SELECT A.*,
        B.*
      FROM SCADA_UNIT A
        OUTER APPLY (
          SELECT *
          FROM (
              SELECT *,
                ROW_NUMBER() OVER (
                  PARTITION BY unit_subname
                  ORDER BY id DESC
                ) AS row_num
              FROM SCADA_METER_2 B
              WHERE B.unit_id = A.unit_id
            ) AS C
          WHERE C.row_num = 1
        ) AS B;
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllScadaUnit,
  getAllScadaUnitMeter
}
