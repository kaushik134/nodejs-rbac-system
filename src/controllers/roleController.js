const roleModel = require("../models/roleModel");
const userModel = require("../models/userModel");
const { roleMsg } = require("../utils/resMessage");
const { validateWithJoi } = require("../utils/validate");
const { createRoleSchema, updateRoleSchema, deleteRoleSchema } = require("../utils/validations/roleValidation");

exports.createRole = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, createRoleSchema);
        if (!isValid) {
            return res.badRequest({
                message: errors.length > 1 ? errors : "Validation error occurred.",
            });
        }

        const { roleName, accessModules } = value

        const existRole = await roleModel.findOne({
            roleName: { $regex: new RegExp(`^${roleName}$`, 'i') }
        })
        if (existRole) {
            return res.conflict({
                message: `Role '${roleName}' already exists`
            })
        }

        const uniqueModules = [...new Set(accessModules)];

        const newRole = await new roleModel({
            roleName,
            accessModules: uniqueModules
        }).save()

        return res.createResource({
            message: roleMsg.createRole,
            data: { newRole },
        });
    } catch (error) {
        console.error("Createt Role Error : ", error)
        return res.internalServerError({
            message: "An error occurred during create role. Please try again later.",
        });
    }
}

exports.getAllRoles = async (req, res) => {
    try {
        const { search, page = 1, size = 10, isActive = "true" } = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(size);
        const skip = (pageNumber - 1) * pageSize;

        let query = {};

        if (search) {
            query.roleName = { $regex: search, $options: "i" };
        }

        if (isActive === "true") query.isActive = true;
        if (isActive === "false") query.isActive = false;

        const roles = await roleModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const totalRecords = await roleModel.countDocuments(query);

        return res.success({
            data: {
                roles,
                pagination: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / pageSize),
                    currentPage: pageNumber,
                    pageSize: pageSize,
                }
            },
            message: roleMsg.fetchRole
        });

    } catch (error) {
        console.error("Get All Role Error:", error);
        return res.internalServerError({
            message: "An error occurred during get role. Please try again later.",
        });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const roles = await roleModel.findById(id).lean();

        if (!roles) {
            return res.notFound({
                message: roleMsg.notFound,
            });
        }

        return res.success({
            message: roleMsg.fetchDetails,
            data: roles,
        });
    } catch (error) {
        console.error("Get Role By ID Error:", error);
        return res.internalServerError({
            message: "An error occurred while fetching role details.",
        });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, updateRoleSchema);

        if (!isValid) {
            return res.badRequest({
                message: errors.length > 1 ? errors : "Validation error occurred.",
            });
        }

        const { roleName, addModule, removeModule } = value;

        const roles = req.role;
        if (roleName) {
            const existsRole = await roleModel.findOne({
                _id: { $ne: roles._id },
                roleName: { $regex: new RegExp(`^${roleName}$`, "i") },
            });

            if (existsRole) {
                return res.conflict({ message: `Role '${roleName}' already exists` });
            }

            roles.roleName = roleName;
        }

        if (addModule) {
            if (roles.accessModules.includes(addModule)) {
                return res.conflict({
                    message: `Module '${addModule}' already exists in this role`,
                });
            }
            roles.accessModules.push(addModule);
        }

        if (removeModule) {
            roles.accessModules = roles.accessModules.filter(
                (module) => module !== removeModule
            );
        }

        roles.accessModules = [...new Set(roles.accessModules)];
        await roles.save();

        return res.success({
            message: roleMsg.updateRole,
            data: roles,
        });

    } catch (error) {
        console.error("Update Role Error:", error);
        return res.internalServerError({
            message: "An error occurred while updating the role.",
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, deleteRoleSchema);
        if (!isValid) {
            return res.badRequest({
                message: errors.length > 1 ? errors : "Validation error occurred.",
            });
        }

        const transferRoleId = value?.transferRoleId || null;
        let { role } = req

        const userCount = await userModel.countDocuments({ role: role._id });
        if (userCount > 0 && !transferRoleId) {
            return res.conflict({
                message: "Role has assigned users. Provide transferRoleId to continue.",
                data: {
                    usersAssigned: userCount,
                    transferredTo: null
                },
            });
        }

        if (transferRoleId) {
            const newRole = await roleModel.findById(transferRoleId);

            if (!newRole) {
                return res.notFound({
                    message: "Transfer roleId does not exist.",
                });
            }

            if (!newRole.isActive) {
                return res.badRequest({
                    message: "Cannot transfer users to an inactive role.",
                });
            }

            await userModel.updateMany(
                { role: role._id },
                { role: transferRoleId }
            );
        }
        await roleModel.findByIdAndDelete(role._id);

        return res.success({
            message: roleMsg.roleDeleted,
            data: {
                previousUsersAssigned: userCount,
                transferredTo: transferRoleId ? transferRoleId : null,
            },
        });

    } catch (error) {
        console.error("Delete Role Error:", error);
        return res.internalServerError({
            message: "An error occurred while deleting the role.",
        });
    }
};
