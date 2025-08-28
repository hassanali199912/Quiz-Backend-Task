const { body } = require("express-validator");

// accept this form =>>
// { username: "string", age: "number", isAdmin: "boolean" }

const buildValidation = (field) => {
    return Object.entries(field).map(([key, type]) => {
        let validator = body(key).notEmpty().withMessage(`${key} is required`).trim();

        switch (type) {
            case "string":
                validator = validator.isString().withMessage(`${key} must be a string`);
                break;
            case "number":
                validator = validator.isNumeric().withMessage(`${key} must be a number`);
                break;
            case "boolean":
                validator = validator.isBoolean().withMessage(`${key} must be a boolean`);
                break;
            case "email":
                validator = validator.isEmail().withMessage(`${key} must be a valid email`);
                break;
        }
        return validator;
    })


}

module.exports = { buildValidation }