const userModule = require("../models/users");
const userBasicCrud = require("../generics/Base-crud");
const userBasicControllers = require("../generics/Base-Controller");
const userBasicRoutes = require("../generics/Base-Routes");
const ResponseHandler = require("../utils/ResponseHandler");
const userBasicCrudObject = new userBasicCrud(userModule);

// Middleware For Protected Routes
const checkToken = require("../middlewares/CheckToken.middleware");
const isAdmin = require("../middlewares/IsAdmin.middleware");
const {
  userLoginValidation,
  userCreateValidation,
  userUpdateValidation,
} = require("../middlewares/user.dataValidation.middleware");
const validationHandlerMiddleware = require("../middlewares/ValidationHandlerMiddelware");
const {
  checkEmailNotExists,
  checkEmailExists,
} = require("../middlewares/emailValidation.meddilware");

class UserControllerCustom extends userBasicControllers {
  constructor(controller) {
    super(controller);
  }

  async login(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const { email, password } = req.body;
      const user = await userBasicCrudObject.filterBy({ email: email });
      if (user.length === 0) {
        return responseHandler.notFound("User not found");
      }

      const userData = await userBasicCrudObject.getById(user[0]._id);
      const isMatch = await userData.comparePassword(password);
      if (!isMatch) {
        return responseHandler.error("Invalid credentials", 401);
      }
      const token = await userData.generateToken();
      return responseHandler.success(
        {
          token: token,
          _id: userData._id,
          role: userData.role === "CODEMODE" ? "ADMIN" : "USER",
          email: userData.email,
          fname: userData.fname,
          lname: userData.lname,
        },
        "Login successful",
        200
      );
    } catch (error) {
      return responseHandler.error(error.message, 500, error);
    }
  }
}

class UserRoutesCustom extends userBasicRoutes {
  constructor(controller) {
    super(controller);
  }

  mainRoutes() {
    this.requiredValidationsRoutes();
    this.protectedRoutes();
    super.mainRoutes();
  }

  protectedRoutes() {
    this.router.post(
      "/",
      checkToken,
      isAdmin,
      userCreateValidation,
      validationHandlerMiddleware,
      checkEmailExists,
      (req, res) => this.controller.create(req, res)
    );

    this.router.put(
      "/:id",
      checkToken,
      isAdmin,
      userUpdateValidation,
      validationHandlerMiddleware,
      checkEmailNotExists,
      (req, res) => this.controller.update(req, res)
    );

    this.router.delete("/:id", checkToken, isAdmin, (req, res) =>
      this.controller.delete(req, res)
    );
  }

  requiredValidationsRoutes() {
    this.router.post(
      "/login",
      userLoginValidation,
      validationHandlerMiddleware,
      checkEmailNotExists,
      (req, res) => this.controller.login(req, res)
    );
  }
}

const userBasicControllersObject = new UserControllerCustom(
  userBasicCrudObject
);
const userBasicRoutesObject = new UserRoutesCustom(userBasicControllersObject);

module.exports = userBasicRoutesObject.getRouter();
