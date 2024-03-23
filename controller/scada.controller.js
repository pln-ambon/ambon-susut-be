const {
  getAllScadaUnit
} = require("../model/scada_unit.model")


async function getAllUnit(req, res) {
  try {
    const units = await getAllScadaUnit()

    res.status(200).json(units)
  } catch (error) {
    res.send(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit
}