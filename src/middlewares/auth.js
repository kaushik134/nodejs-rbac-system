const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { auth } = require("../utils/resMessage");

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.unauthorized({ message: auth.accessDenied });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userId = decoded.userId;

        const user = await userModel
            .findById(decoded.userId)
            .populate("role", "roleName accessModules isActive");

        if (!user) {
            return res.unauthorized({ message: "Invalid token. User not found." });
        }

        if (!user.isActive) {
            return res.forbidden({ message: "User account is inactive." });
        }

        if (!user.role.isActive) {
            return res.forbidden({ message: "Assigned role is inactive." });
        }

        req.userId = user._id;
        req.userRole = user.role.roleName;
        req.userAccessModules = user.role.accessModules || [];

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.unauthorized({ message: "Invalid or expired token." });
    }
};
