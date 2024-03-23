const router = require("express").Router();
const { getAllUnit, getAllUnitMeter, getTableTotal } = require("../../controller/scada.controller")

router.get("/units", getAllUnit)
router.get("/unit-meters", getAllUnitMeter)
router.get("/total-table", getTableTotal)

module.exports = router
