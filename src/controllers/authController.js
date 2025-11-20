const roleModel = require("../models/roleModel");
const tokenModel = require("../models/tokenModel");
const userModel = require("../models/userModel");
const { generateToken, verifyRefreshToken } = require("../utils/common");
const { auth, userMsg } = require("../utils/resMessage");
const { validateWithJoi } = require("../utils/validate");
const { registerSchema, loginSchema } = require("../utils/validations/authValidation");

exports.register = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, registerSchema);

        if (!isValid) {
            return res.badRequest({
                message: errors.length > 1 ? errors : "Validation error occurred.",
            });
        }

        const { firstName, lastName, email, password, role } = value;

        const roleData = await roleModel.findById(role);
        if (!roleData) {
            return res.notFound({ message: "Assigned role not found." });
        }

        if (!roleData.isActive) {
            return res.forbidden({ message: "Assigned role is inactive." });
        }

        const existUser = await userModel.findOne({ email });
        if (existUser) {
            if (existUser.isActive) {
                return res.conflict({ message: auth.emailTaken });
            }

            existUser.firstName = firstName;
            existUser.lastName = lastName;
            existUser.password = password;
            existUser.role = role;
            existUser.isActive = true;

            await existUser.save();
            return res.success({
                message: userMsg.reActivate,
                data: existUser
            });
        }

        const newUser = await new userModel({
            firstName,
            lastName,
            email,
            password,
            role,
        }).save()

        return res.createResource({
            message: auth.registerSuccess,
            data: { userId: newUser._id, email: newUser.email },
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.internalServerError({
            message: "An error occurred during registration. Please try again later.",
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { isValid, value, errors } = validateWithJoi(req.body, loginSchema);
        if (!isValid) {
            return res.badRequest({
                message: errors.length > 1 ? errors : "Validation error occurred.",
            });
        }

        const { email, password } = value;
        const user = await userModel
            .findOne({ email })
            .select("+password")
            .populate("role", "roleName isActive accessModules");
        if (!user) {
            return res.notFound({ message: auth.notFound });
        }

        if (!user.isActive) {
            return res.forbidden({ message: "User account is inactive." });
        }

        if (!user.role.isActive) {
            return res.forbidden({ message: "Assigned role is inactive." });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.unauthorized({ message: auth.invalidCredentials });
        }

        const { accessToken, refreshToken } = await generateToken({
            userId: user._id,
            role: user.role,
        });

        return res.success({
            message: auth.loginSuccess,
            data: { accessToken, refreshToken },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.internalServerError({
            message: "An error occurred during login. Please try again later.",
        });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.badRequest({ message: "Refresh token is required." });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.unauthorized({ message: "Invalid or expired refresh token." });
        }

        const storedToken = await tokenModel.findOne({
            userId: decoded.userId,
            refreshToken: refreshToken,
        });

        if (!storedToken) {
            return res.unauthorized({
                message: "Refresh token invalid or logged out already.",
            });
        }

        const user = await userModel
            .findById(decoded.userId)
            .populate("role", "roleName isActive accessModules");

        if (!user) {
            return res.notFound({ message: "User not found." });
        }

        if (!user.isActive) {
            return res.forbidden({ message: "User account is inactive." });
        }

        if (!user.role.isActive) {
            return res.forbidden({ message: "Assigned role is inactive." });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateToken({
            userId: user._id,
            role: user.role,
        });

        return res.success({
            message: "Token refreshed successfully.",
            data: { accessToken, refreshToken: newRefreshToken },
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.internalServerError({
            message: "Failed to refresh token.",
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.badRequest({ message: "Refresh token is required." });
        }

        await tokenModel.findOneAndDelete({ refreshToken });

        return res.success({
            message: "Logged out successfully.",
        });

    } catch (error) {
        console.error("Logout Error:", error);
        return res.internalServerError({
            message: "Failed to logout.",
        });
    }
};

exports.checkUserAccess = async (req, res) => {
    try {
        const accessModules = req.userAccessModules || [];
        const normalizedModules = accessModules.map(m => m.trim().toLowerCase());

        const { module } = req.query;

        if (module) {
            const normalized = module.trim().toLowerCase();
            const hasAccess = normalizedModules.includes(normalized);

            return res.success({
                message: "Access check result",
                data: {
                    module,
                    hasAccess
                }
            });
        }

        return res.success({
            message: "User access modules fetched",
            data: {
                accessModules
            }
        });

    } catch (error) {
        console.error("Check Access Error:", error);
        return res.internalServerError({
            message: "An error occurred while checking access.",
        });
    }
};

