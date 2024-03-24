const router = require("express").Router();
const { 
  getAllUnit, 
  getAllUnitMeter, 
  getTableTotal,
  getDataMap,
  getTableDetail,
  getDataGrafikbeban
} = require("../../controller/scada.controller")

router.get("/units", getAllUnit)
router.get("/unit-meters", getAllUnitMeter)
router.get("/total-table", getTableTotal)
router.get("/detail-table", getTableDetail)
router.get("/data-map", getDataMap)
router.get("/grafik-beban", getDataGrafikbeban)

module.exports = router
