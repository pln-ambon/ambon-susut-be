const router = require("express").Router();
const auth = require("./auth")
const scada = require("./monitoring")

const { authentication } = require("../middleware/authentication")

router.use("/auth", auth)
// router.use(authentication)
router.use("/scada", scada)

module.exports = router