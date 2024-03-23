const router = require("express").Router();
const { getAllUnit } = require("../../controller/scada.controller")

router.get("/units", getAllUnit)

module.exports = router
