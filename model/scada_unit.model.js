const sql = require('mssql');
const { sqlConfig } =require("../config")

async function getAllScadaUnitMeter() {
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
}

async function getAllDataGrafik() {
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
      ) AS B
      WHERE A.unit_id in (11,12,13,14)
    `);

  return result.recordset;
}

async function getDataEveryMinutes({ unitId, startTime }) {
  const pool = await sql.connect(sqlConfig);
  const result = await pool.request()
    .input('unit_id', sql.Int, unitId)
    // .input('time', sql.DateTime, startTime)
    .query(`
      SELECT p, time, unit_id
      FROM SCADA_METER_2
      WHERE time >= DATEADD(HOUR, -24, GETDATE())
          AND DATEPART(MINUTE, time) % 1 = 0
          AND unit_id = @unit_id
      ORDER BY id ASC;

    `);

  return result.recordset;
}

async function getLastSpiningAndReserve() {
  const pool = await sql.connect(sqlConfig)
  const result = await pool.request()
    .query(`
      SELECT TOP (1) * 
      FROM SCADA_METER_3 
      ORDER BY time DESC; 
    `);

  return result.recordset;
}

module.exports = {
  getAllScadaUnitMeter,
  getDataEveryMinutes,
  getAllDataGrafik,
  getLastSpiningAndReserve
}
