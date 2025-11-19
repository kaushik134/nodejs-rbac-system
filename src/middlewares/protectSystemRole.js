const roleModel = require("../models/roleModel");

exports.protectSystemRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await roleModel.findById(id);
        if (!role) {
            return res.notFound({ message: "Role not found" });
        }

        const roleName = role.roleName?.trim().toLowerCase();
        const systemRoles = ["Admin", "Super Admin"];

        if (systemRoles.includes(roleName)) {
            return res.forbidden({
                message: `System role '${role.roleName}' cannot be modified or deleted.`,
            });
        }

        const loggedUserRole = req.userRole?.trim().toLowerCase();
        console.log(loggedUserRole)
        console.log(role.roleName)
        if (loggedUserRole === role.roleName) {
            return res.forbidden({
                message: "You cannot delete the role you are assigned to.",
            });
        }

        req.role = role;
        next();

    } catch (error) {
        console.error("protectSystemRole Error:", error);
        return res.internalServerError({
            message: "Role validation failed.",
        });
    }
};
