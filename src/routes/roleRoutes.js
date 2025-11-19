const router = require("express").Router();

const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require("../controllers/roleController");
const { auth } = require("../middlewares/auth");
const { authorize } = require("../middlewares/authorize");
const { checkAccess } = require("../middlewares/checkAccess");
const { protectSystemRole } = require("../middlewares/protectSystemRole");

router.get("/", getAllRoles);

router.use(auth);
router.use(checkAccess("roles"))

router.post("/", authorize(["Admin"]), createRole);
router.get("/:id", authorize(["Admin", "Manager"]), getRoleById);
router.put("/:id", authorize(["Admin"]), protectSystemRole, updateRole);
router.delete("/:id", authorize(["Admin"]), protectSystemRole, deleteRole);

module.exports = router;
