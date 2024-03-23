const router = require("express").Router();
const auth = require("./auth")
const scada = require("./monitoring")

const { authentication } = require("../middleware/authentication")

router.use("/auth", auth)
router.use("/scada", authentication, scada)

module.exports = router