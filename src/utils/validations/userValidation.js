const joi = require("joi");

const objectId = joi.string().hex().length(24).messages({
    "string.hex": "Invalid ID format.",
    "string.length": "ID must be a valid 24-character hex string."
});

const emailSchema = joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
        "string.email": "Enter a valid email.",
        "any.required": "Email is required.",
    });

const passwordSchema = joi
    .string()
    .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,50}$/,
        "strong password"
    )
    .required()
    .messages({
        "string.empty": "Password is required.",
        "string.pattern.name":
            "Password must be 6+ characters & include: uppercase, lowercase, number & special character.",
    });

exports.createUserSchema = joi.object({
    firstName: joi.string().min(2).required().messages({
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 2 characters long.",
    }),
    lastName: joi.string().min(2).required().messages({
        "string.empty": "Last name is required.",
        "string.min": "Last name must be at least 2 characters long.",
    }),
    email: emailSchema,
    password: passwordSchema,
    role: objectId.required().messages({
        "any.required": "Role ID is required."
    })
});

exports.updateUserSchema = joi.object({
    firstName: joi.string().min(2).trim().messages({
        "string.min": "First name must be at least 2 characters long."
    }),
    lastName: joi.string().min(2).trim().messages({
        "string.min": "Last name must be at least 2 characters long."
    }),
    email: joi.string().email({ tlds: { allow: false } }).messages({
        "string.email": "Enter a valid email address."
    }),
    role: objectId.required().messages({
        "any.required": "Role ID is required."
    })
})
    .or("firstName", "lastName", "email", "role")
    .messages({
        "object.missing": "Provide at least one field to update."
    });

exports.bulkSameSchema = joi.object({
    update: joi.object({
        firstName: joi.string().min(2),
        lastName: joi.string().min(2),
        role: joi.string().hex().length(24)
    })
        .min(1)
        .required()
        .messages({
            "object.base": "Update must be an object.",
            "any.required": "Update data is required.",
            "object.min": "Provide at least one field (firstName, lastName, role)."
        })
});

exports.bulkDifferentSchema = joi.object({
    updates: joi.array()
        .items(
            joi.object({
                userId: objectId.required(),
                update: joi.object({
                    firstName: joi.string().min(2),
                    lastName: joi.string().min(2),
                    role: joi.string().hex().length(24)
                })
                    .min(1)
                    .required()
                    .messages({
                        "object.min": "Provide at least one field (firstName, lastName, role)."
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            "array.min": "At least one update entry is required.",
            "any.required": "Updates array is required."
        })
});
