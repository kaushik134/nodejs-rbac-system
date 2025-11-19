const joi = require("joi")

exports.createRoleSchema = joi.object({
    roleName: joi.string().min(2).required().messages({
        "string.empty": "Role name is required",
        "string.min": "Role name must be at least 2 characters"
    }),
    accessModules: joi.array().items(joi.string().trim()).min(1).required().messages({
        "array.min": "At least one access module is required.",
        "any.required": "accessModules field is required.",
        "array.base": "accessModules must be an array."
    })
})

exports.updateRoleSchema = joi.object({
    roleName: joi.string().min(2).messages({
        "string.min": "Role name must be at least 2 characters long",
    }),
    addModule: joi.string().trim().messages({
        "string.empty": "Module name cannot be empty",
    }),
    removeModule: joi.string().trim().messages({
        "string.empty": "Module name cannot be empty",
    })
}).or("roleName", "addModule", "removeModule")
    .messages({
        "object.missing": "Provide at least one field to update.",
    });

exports.deleteRoleSchema = joi.object({
    transferRoleId: joi.string().hex().length(24).optional().messages({
        "string.hex": "Invalid ID format.",
        "string.length": "Transfer role must be a valid 24-character ObjectId."
    }),
});