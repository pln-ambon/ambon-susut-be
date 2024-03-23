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


async function getTableTotal(req, res) {
  try {
    
    const data = await getAllScadaUnitMeter()

    let daya = 0
    let dmp = 0
    let voltage = 0
    let curent = 0
    let cos_phi = 0
    let freq = 0

    data?.forEach(val => {
      data += val.p || 0
      dmp += val.p_dmp || 0
      voltage += val.v || 0
      curent += val.i || 0
      cos_phi += val.pf || 0
      freq += val.f || 0
    })

    const result = {
      daya,
      dmp,
      voltage: voltage / data.length,
      curent: curent / data.length,
      cos_phi: cos_phi / data.length,
      freq: freq / data.length
    }

    res.status(200).json(result)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit,
  getAllUnitMeter,
  getTableTotal
}