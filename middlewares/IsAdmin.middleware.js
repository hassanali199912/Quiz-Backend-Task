const UserModule = require("../models/users");
const ResponseHandler = require("../utils/ResponseHandler");
const BASIC_CRUD = require("../generics/Base-crud")



const isAdmin = async (req, res, next) => {

    const responseHandler = new ResponseHandler(res);
    const CrudModule = new BASIC_CRUD(UserModule)
    try {

        const userId = req.userId
        const userData = await CrudModule.getById(userId);
        if (!userData) {
            return responseHandler.notFound("User not found");
        }
        if (userData.role !== "CODEMODE") {
            return responseHandler.error("Unauthorized", 401);
        }

        next();

    } catch (error) {

        return responseHandler.error(error.message, 500, error);
    }

}



module.exports = isAdmin