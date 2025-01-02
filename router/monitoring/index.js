const router = require("express").Router();
const { 
  getTableTotal,
  getDataMap,
  getTableDetail,
  getDataGrafikbeban,
  getLatest24HourEveryMinute,
  getDataMapTernate,
  getDataGrafikbebanTernate,
  getTableTotalTernate
} = require("../../controller/scada.controller")


router.get("/total-table", getTableTotal)
router.get("/detail-table", getTableDetail)
router.get("/data-map", getDataMap)
router.get("/grafik-beban", getDataGrafikbeban)
router.get("/24-hour", getLatest24HourEveryMinute)

// ternate
router.get("/ternate/data-map", getDataMapTernate)
router.get("/ternate/grafik-beban", getDataGrafikbebanTernate)
router.get("/ternate/total-table", getTableTotalTernate)



module.exports = router
