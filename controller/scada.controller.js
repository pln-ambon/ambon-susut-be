const {
  getAllScadaUnit
} = require("../model/scada_unit.model")


async function getAllUnit(req, res) {
  try {
    console.log("<< get all unit");
    const units = await getAllScadaUnit()

    res.status(200).json(units)
  } catch (error) {
    res.status(error?.code || 500 ).json(error)
  }
}

module.exports = {
  getAllUnit
}