const quizModule = require("../models/quiz");
const quizBasicCrud = require("../generics/Base-crud");
const quizBasicControllers = require("../generics/Base-Controller");
const quizBasicRoutes = require("../generics/Base-Routes");
const quizBasicCrudObject = new quizBasicCrud(quizModule);

// Middleware For Protected Routes
const checkToken = require("../middlewares/CheckToken.middleware");
const isAdmin = require("../middlewares/IsAdmin.middleware");

class QuizRoutesCustom extends quizBasicRoutes {
  constructor(controller) {
    super(controller);
  }

  mainRoutes() {
    this.protectedRoutes();
    super.mainRoutes();
  }

  protectedRoutes() {
    this.router.post("/", checkToken, isAdmin, (req, res) =>
      this.controller.create(req, res)
    );

    this.router.put("/:id", checkToken, isAdmin, (req, res) =>
      this.controller.update(req, res)
    );

    this.router.delete("/:id", checkToken, isAdmin, (req, res) =>
      this.controller.delete(req, res)
    );
  }
}

const quizBasicControllersObject = new quizBasicControllers(
  quizBasicCrudObject
);
const quizBasicRoutesObject = new QuizRoutesCustom(quizBasicControllersObject);

module.exports = quizBasicRoutesObject.getRouter();
