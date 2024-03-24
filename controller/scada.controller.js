const {
  getAllScadaUnit,
  getAllScadaUnitMeter
} = require("../model/scada_unit.model")

async function getAllUnit(req, res) {
  try {
    
    const units = await getAllScadaUnit()

    res.status(200).json(units)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getAllUnitMeter(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getDataMap(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = {
          pTotal: 0,
          vTotal: 0,
          vLength: 0,
          vAverage: 0,
        }
      }
      acc[key].pTotal += obj.p / 1000 // MW
      acc[key].vTotal += obj.v
      acc[key].vLength += 1
      acc[key].vAverage += acc[key].vTotal / acc[key].vLength
    
      return acc;
    }, {});

    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

async function getTableTotal(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    let daya = 0
    let dmp = 0
    let voltage = 0
    let curent = 0
    let cos_phi = 0
    let freq = 0
    let susut = 0

    data?.forEach(val => {
      daya += (val.p || 0) / 1000 // MW
      dmp += (val.p_dmp || 0) / 1000 // MW
      voltage += val.v || 0
      curent += val.i || 0
      cos_phi += val.pf || 0
      freq += val.f || 0
      susut += val.susut || 0
    })

    const result = {
      daya,
      dmp,
      voltage: voltage / data.length,
      curent: curent / data.length,
      cos_phi: cos_phi / data.length,
      freq: freq / data.length,
      susut,
    }

    res.status(200).json({
      data,
      result
    })
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}


async function getTableDetail(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    const groupedData = data.reduce((acc, obj) => {
      const key = obj.unit_name;
      if (!acc[key]) {
        acc[key] = {
          total: {
            p_dmp_netto: 0,
            p_dmp_pasok: 0,
            p: 0,
            vTotal: 0,
            vLength: 0,
            vAverage: 0,
          },
          detail: []
        }
      }
    
      // total
      acc[key].total.p_dmp_netto += obj.p_dmp_netto / 1000 // MW
      acc[key].total.p_dmp_pasok += obj.p_dmp_pasok / 1000
      acc[key].total.p += obj.p / 1000
      acc[key].total.vTotal += obj.v // KV
      acc[key].total.vLength += 1
      acc[key].total.vAverage += acc[key].total.vTotal / acc[key].total.vLength
    
      // detail
      acc[key].detail.push({
        unit_subname: obj.unit_subname,
        p_dmp_netto: obj.p_dmp_netto / 1000,
        p_dmp_pasok: obj.p_dmp_pasok / 1000,
        p: obj.p / 1000,
        v: obj.v
      })
    
      return acc;
    }, {});
    res.status(200).json(groupedData)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit,
  getAllUnitMeter,
  getDataMap,
  getTableTotal,
  getTableDetail,
}