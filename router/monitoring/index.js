const router = require("express").Router();
const { getAllUnit, getAllUnitMeter } = require("../../controller/scada.controller")

router.get("/units", getAllUnit)
router.get("/unit-meters", getAllUnitMeter)

module.exports = router
