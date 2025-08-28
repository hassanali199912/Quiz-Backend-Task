const ResponseHandler = require("../utils/ResponseHandler");
const mongoose = require("mongoose");

const validationQueryParam = (paramNames = []) => {
    return async (req, res, next) => {
        const responseHandler = new ResponseHandler(res);
        const errors = [];

        paramNames.forEach((paramName) => {
            const value = req.query[paramName];

            if (!value || value.trim() === "") {
                errors.push({
                    field: paramName,
                    message: `${paramName} is required`,
                });
            } else if (!mongoose.Types.ObjectId.isValid(value)) {
                errors.push({
                    field: paramName,
                    message: `${paramName} must be a valid ObjectId`,
                });
            }
        });

        if (errors.length > 0) {
            return responseHandler.validationError(errors);
        }

        next();
    };
};

module.exports = validationQueryParam;
