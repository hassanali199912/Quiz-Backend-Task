const { validationResult } = require("express-validator");
const ResponseHandler = require("../utils/ResponseHandler");

const validationHandlerMiddleware = (req, res, next) => {
  const responseHandler = new ResponseHandler(res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseHandler.error(errors.array(), 400);
  }
  next();
};

module.exports = validationHandlerMiddleware;
