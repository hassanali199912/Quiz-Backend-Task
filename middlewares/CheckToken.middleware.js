const jwt = require("jsonwebtoken");
const ResponseHandler = require("../utils/ResponseHandler");

const checkToken = (req, res, next) => {
  const responseHandler = new ResponseHandler(res);
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return responseHandler.authorizathionError("Not authenticated.");
    }

    let token = req.get("Authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (!decodedToken) {
      return responseHandler.authorizathionError("Not authenticated.");
    }
    req.userId = decodedToken.id;
    next();
  } catch (err) {
    return responseHandler.error(err.message, 500, err);
  }
};

module.exports = checkToken;
