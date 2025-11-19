const joi = require("joi");

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

exports.registerSchema = joi.object({
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
    role: joi.string().hex().length(24).required().messages({
        "string.empty": "Role ID is required.",
        "string.length": "Role ID must be a valid 24-character hex string.",
    }),
});

exports.loginSchema = joi.object({
    email: emailSchema,
    password: passwordSchema,
});