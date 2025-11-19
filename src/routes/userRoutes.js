const router = require("express").Router()

const { createUser, getAllUsers, getUserById, updateUser, deleteUser, bulkUpdateSame, bulkUpdateDifferent } = require("../controllers/userController")
const { auth } = require("../middlewares/auth")
const { authorize } = require("../middlewares/authorize")
const { checkAccess } = require("../middlewares/checkAccess")

router.use(auth)
router.use(checkAccess("users"))

router.post("/", authorize(["Admin", "Manager"]), createUser)
router.get("/", authorize(["Admin", "Manager", "Viewer"]), getAllUsers)
router.get("/:id", authorize(["Admin", "Manager", "Viewer"], { isOwn: true }), getUserById);
router.put("/:id", authorize(["Admin", "Manager"], { isOwn: true }), updateUser);
router.delete("/:id", authorize(["Admin"]), deleteUser);
router.patch("/bulk/same", authorize(["Admin"]), bulkUpdateSame);
router.patch("/bulk/different", authorize(["Admin"]), bulkUpdateDifferent);

module.exports = router;
