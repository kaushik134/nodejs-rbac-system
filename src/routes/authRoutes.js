const router = require("express").Router();

const { register, login, checkUserAccess, refreshToken, logout } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

router.post("/signUp", register)
router.post("/login", login)
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);
router.get("/checkAccess", auth, checkUserAccess);

module.exports = router;