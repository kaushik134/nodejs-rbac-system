exports.checkAccess = (moduleName) => {
    return (req, res, next) => {
        try {
            const moduleToCheck = moduleName.trim().toLowerCase()
            const accessModules = (req.userAccessModules || []).map(value =>
                value.trim().toLowerCase()
            )

            if (!accessModules.includes(moduleToCheck)) {
                return res.forbidden({
                    message: `Access denied. Missing permission for module '${moduleToCheck}'.`,
                });
            }

            next();
        } catch (error) {
            console.error("checkAccess Middleware Error:", error);
            return res.internalServerError({
                message: "Module access validation failed.",
            });
        }
    };
};
