const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");

const { userMsg } = require("../utils/resMessage");
const { validateWithJoi } = require("../utils/validate");
const { createUserSchema, updateUserSchema, bulkSameSchema, bulkDifferentSchema } = require("../utils/validations/userValidation");

exports.createUser = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, createUserSchema);

        if (!isValid) {
            return res.badRequest({ message: errors.length > 1 ? errors : "Validation error occurred." });
        }

        const { firstName, lastName, email, password, role } = value;

        const roleData = await roleModel.findById(role);
        if (!roleData) {
            return res.notFound({ message: "Assigned role not found" });
        }
        if (!roleData.isActive) {
            return res.forbidden({ message: "Assigned role is inactive" });
        }

        const existEmail = await userModel.findOne({ email });
        if (existEmail) {
            if (existEmail.isActive) {
                return res.conflict({ message: userMsg.emailTaken });
            }

            existEmail.firstName = firstName;
            existEmail.lastName = lastName;
            existEmail.password = password;
            existEmail.role = role;
            existEmail.isActive = true;

            await existEmail.save();
            return res.success({
                message: userMsg.reActivate,
                data: existEmail
            });
        }

        const newUser = await new userModel({
            firstName,
            lastName,
            email,
            password,
            role
        }).save();

        return res.createResource({
            message: userMsg.userCreated,
            data: newUser,
        });

    } catch (error) {
        console.error("Create User Error:", error);
        return res.internalServerError({
            message: "An error occurred while creating user.",
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, size = 10, isActive = "true" } = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(size);
        const skip = (pageNumber - 1) * pageSize;

        let query = {}

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (isActive === "true") query.isActive = true;
        if (isActive === "false") query.isActive = false;

        const users = await userModel
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate("role", "roleName accessModules")
            .lean();

        const totalRecords = await userModel.countDocuments(query);

        return res.success({
            message: userMsg.fetchUsers,
            data: {
                users,
                pagination: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / pageSize),
                    currentPage: pageNumber,
                    pageSize: pageSize
                }
            }
        });

    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.internalServerError({
            message: "An error occurred while fetching users.",
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel
            .findById(id)
            .populate("role", "roleName accessModules")
            .lean();

        if (!user) {
            return res.notFound({
                message: userMsg.notFound,
            });
        }

        return res.success({
            message: userMsg.fetchUserDetails,
            data: user,
        });

    } catch (error) {
        console.error("Get User Error:", error);
        return res.internalServerError({
            message: "An error occurred while fetching user details.",
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req

        const { isValid, value, errors } = validateWithJoi(req.body, updateUserSchema);
        if (!isValid) {
            return res.badRequest({ message: errors.length > 1 ? errors : "Validation error occurred." });
        }

        const { firstName, lastName, email, role } = value;

        let user = await userModel.findById(id);
        if (!user) {
            return res.notFound({ message: userMsg.notFound });
        }

        if (role && req.userId === id) {
            const currentRole = await roleModel.findById(user.role);
            const currentRoleName = currentRole.roleName.trim().toLowerCase();

            const protectedRoles = ["admin", "super admin"];

            if (protectedRoles.includes(currentRoleName)) {
                return res.forbidden({
                    message: `You cannot change your own '${currentRole.roleName}' role.`,
                });
            }
        }

        if (email && email !== user.email) {
            const checkEmail = await userModel.findOne({ email });
            if (checkEmail) {
                return res.conflict({ message: userMsg.emailTaken });
            }
            user.email = email;
        }

        if (role) {
            const roleData = await roleModel.findById(role);
            if (!roleData) {
                return res.notFound({ message: "Assigned role not found." });
            }
            if (!roleData.isActive) {
                return res.forbidden({ message: "Assigned role is inactive." });
            }
            user.role = role;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        await user.save();

        return res.success({
            message: userMsg.userUpdated,
            data: user,
        });

    } catch (error) {
        console.error("Update User Error:", error);
        return res.internalServerError({
            message: "An error occurred while updating user.",
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req

        const user = await userModel.findById(id);
        if (!user) {
            return res.notFound({ message: userMsg.notFound });
        }

        if (userId === id) {
            return res.forbidden({
                message: "You cannot delete your own account.",
            });
        }

        const systemRoles = ["Admin", "Super Admin"];
        const roleData = await roleModel.findById(user.role);
        if (roleData) {
            const normalizedRoleName = roleData.roleName?.trim().toLowerCase();
            if (systemRoles.includes(normalizedRoleName)) {
                return res.forbidden({
                    message: `System account '${roleData.roleName}' cannot be deleted.`,
                });
            }
        }

        await userModel.findByIdAndUpdate(id, { isActive: false })

        return res.success({
            message: userMsg.userDeleted,
            data: { userId: id },
        });

    } catch (error) {
        console.error("Delete User Error:", error);
        return res.internalServerError({
            message: "An error occurred while deleting user.",
        });
    }
};

exports.bulkUpdateSame = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, bulkSameSchema);

        if (!isValid) {
            return res.badRequest({ message: errors });
        }

        const { update } = value;
        if (update.role) {
            const newRole = await roleModel.findById(update.role);

            if (!newRole) {
                return res.notFound({ message: "Assigned role not found." });
            }

            if (!newRole.isActive) {
                return res.forbidden({ message: "Assigned role is inactive." });
            }

            const newRoleName = newRole.roleName.trim().toLowerCase();
            const systemRoles = ["admin", "super admin"];

            if (systemRoles.includes(newRoleName)) {
                return res.forbidden({
                    message: "You cannot assign Admin / Super Admin roles in bulk update."
                });
            }
        }

        const result = await userModel.updateMany({ isActive: true }, update);

        return res.success({
            message: userMsg.bulkSameSuccess,
            data: result
        });

    } catch (error) {
        console.error("Bulk Same Error:", error);
        return res.internalServerError({
            message: "Error updating users.",
        });
    }
};

exports.bulkUpdateDifferent = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, bulkDifferentSchema);

        if (!isValid) {
            return res.badRequest({ message: errors });
        }

        const { updates } = value;

        const loggedInUserId = req.userId;

        const systemRoles = ["admin", "super admin"];

        const bulkOps = [];

        for (let item of updates) {
            const user = await userModel.findById(item.userId);
            if (!user) {
                return res.notFound({ message: `User not found: ${item.userId}` });
            }

            if (!user.isActive) {
                return res.forbidden({
                    message: `User ${item.userId} is inactive and cannot be updated.`
                });
            }

            const userRole = await roleModel.findById(user.role);
            const currentRoleName = userRole?.roleName?.trim().toLowerCase();

            if (systemRoles.includes(currentRoleName)) {
                return res.forbidden({
                    message: `System user '${userRole.roleName}' cannot be updated in bulk.`
                });
            }

            if (user._id.toString() === loggedInUserId && item.update.role) {
                return res.forbidden({
                    message: "You cannot update your own role in bulk operation."
                });
            }

            if (item.update.role) {
                const newRole = await roleModel.findById(item.update.role);

                if (!newRole) {
                    return res.notFound({
                        message: `Invalid new role for user ${item.userId}`
                    });
                }

                if (!newRole.isActive) {
                    return res.forbidden({
                        message: `Cannot assign inactive role to user ${item.userId}`
                    });
                }

                const newRoleName = newRole.roleName.trim().toLowerCase();

                if (systemRoles.includes(newRoleName)) {
                    return res.forbidden({
                        message: "You cannot assign Admin / Super Admin roles in bulk update."
                    });
                }
            }

            bulkOps.push({
                updateOne: {
                    filter: { _id: user._id },
                    update: item.update
                }
            });
        }

        const result = await userModel.bulkWrite(bulkOps);

        return res.success({
            message: userMsg.bulkDifferentSuccess,
            data: result
        });

    } catch (error) {
        console.error("Bulk Different Error:", error);
        return res.internalServerError({
            message: "Bulk update failed.",
        });
    }
};
