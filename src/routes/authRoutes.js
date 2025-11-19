const router = require("express").Router();

const { register, login, checkUserAccess } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

router.post("/signUp", register)
router.post("/login", login)
router.get("/checkAccess", auth, checkUserAccess);

module.exports = router;