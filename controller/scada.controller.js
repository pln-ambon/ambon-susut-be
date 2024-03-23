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
    
    const units = await getAllScadaUnitMeter()

    res.status(200).json(units)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit,
  getAllUnitMeter
}