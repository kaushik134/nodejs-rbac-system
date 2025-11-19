exports.authorize = (allowedRoles = [], { isOwn = false } = {}) => {
    return (req, res, next) => {
        try {
            const userRole = req.userRole?.trim().toLowerCase();
            const loggedInUserId = req.userId;
            const targetUserId = req.params.id;

            const normalizedAllowed = allowedRoles.map(r => r.trim().toLowerCase());
            if (normalizedAllowed.includes(userRole)) {
                return next();
            }

            if (isOwn && loggedInUserId === targetUserId) {
                return next();
            }

            return res.forbidden({
                message: isOwn
                    ? "You can only access your own profile."
                    : `Access denied. Requires roles: ${allowedRoles.join(", ")}`,
            });

        } catch (error) {
            console.error("Authorization Middleware Error:", error);
            return res.internalServerError({ message: "Authorization failed." });
        }
    };
};
