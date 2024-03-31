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

async function get24HourLatestData({ unitId }) {
  try {

    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('unit_id', sql.Int, unitId)
      .query(`
        SELECT *
        FROM SCADA_METER_2
        WHERE time >= DATEADD(HOUR, -24, GETDATE())
          AND DATEPART(MINUTE, time) = 0
          AND unit_id = @unit_id;
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

async function getDataEvery5Minutes({ unitId }) {
  try {

    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('unit_id', sql.Int, unitId)
      .query(`
      DECLARE @start_time DATETIME

      SET @start_time = 
          CASE
              WHEN DATEPART(MINUTE, GETDATE()) >= 30 THEN DATEADD(MINUTE, -30, CAST(CONVERT(date, GETDATE()) AS DATETIME))
              ELSE DATEADD(MINUTE, -60, CAST(CONVERT(date, GETDATE()) AS DATETIME))
          END
      
      SELECT *
      FROM SCADA_METER_2
      WHERE time >= @start_time
          AND DATEPART(MINUTE, time) % 1 = 0
          AND unit_id = @unit_id;
      
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllScadaUnit,
  getAllScadaUnitMeter,
  get24HourLatestData,
  getDataEvery5Minutes
}
