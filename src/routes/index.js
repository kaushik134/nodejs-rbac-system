const router = require("express").Router()

router.use("/auth", require("./authRoutes"))
router.use("/role", require("./roleRoutes"))
router.use("/user", require("./userRoutes"))

module.exports = router;
