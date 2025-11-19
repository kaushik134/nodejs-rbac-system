exports.validateWithJoi = (payload, schema) => {
    const { value, error } = schema.validate(payload, { abortEarly: false });

    if (!error) {
        return { isValid: true, value };
    }

    const message = error.details.map((el) => el.message).join("\n");
    return {
        isValid: false,
        errors: message,
    };
};
