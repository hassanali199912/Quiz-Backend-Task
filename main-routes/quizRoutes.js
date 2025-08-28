const quizModule = require("../models/quiz");
const quizBasicCrud = require("../generics/Base-crud");
const quizBasicControllers = require("../generics/Base-Controller");
const quizBasicRoutes = require("../generics/Base-Routes");
const ResponseHandler = require("../utils/ResponseHandler");

const quizBasicCrudObject = new quizBasicCrud(quizModule);

// Middleware For Protected Routes
const checkToken = require("../middlewares/CheckToken.middleware");
const isAdmin = require("../middlewares/IsAdmin.middleware");
//const { quizCreateValidation, quizUpdateValidation } = require("../middlewares/quizValidation.middleware");
const validationHandlerMiddleware = require("../middlewares/ValidationHandlerMiddelware");

class QuizControllerCustom extends quizBasicControllers {
  constructor(controller) {
    super(controller);
  }

  // Override create method to add createdBy field
  async create(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      // Add the user ID from the token
      req.body.createdBy = req.userId;
      const data = await this.service.create(req.body);
      responseHandler.success(data, "Quiz created successfully", 201);
    } catch (error) {
      responseHandler.validationError(error.message);
    }
  }

  // Override getAll to filter by course if provided
  async getAll(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      let data;
      if (req.query.course) {
        data = await this.service.filterBy({ course: req.query.course, isActive: true });
      } else {
        data = await this.service.filterBy({ isActive: true });
      }
      responseHandler.success(data, "Quizzes retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Override filter to only show active quizzes
  async filter(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const filter = { ...req.query, isActive: true };
      const data = await this.service.filterBy(filter);
      responseHandler.success(data, "Filtered quizzes retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Custom method to get quiz with populated author
  async getQuizWithAuthor(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const data = await this.service.getByIdPopulate(req.params.id, "createdBy");
      if (!data) return responseHandler.notFound("Quiz not found");
      responseHandler.success(data, "Quiz retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }
}

class QuizRoutesCustom extends quizBasicRoutes {
  constructor(controller) {
    super(controller);
  }

  mainRoutes() {
    this.publicRoutes();
    this.protectedRoutes();
    // Don't call super.mainRoutes() as we're overriding all routes
  }

  // Public routes (authenticated users can view)
  publicRoutes() {
    // Get all quizzes (with optional course filter)
    this.router.get("/", 
      checkToken, 
      (req, res) => this.controller.getAll(req, res)
    );

    // Get single quiz
    this.router.get("/:id", 
      checkToken, 
      (req, res) => this.controller.getById(req, res)
    );

    // Get quiz with populated author
    this.router.get("/:id/with-author", 
      checkToken, 
      (req, res) => this.controller.getQuizWithAuthor(req, res)
    );

    // Filter quizzes
    this.router.get("/filter", 
      checkToken, 
      (req, res) => this.controller.filter(req, res)
    );
  }

  // Protected routes (admin/teachers only)
  protectedRoutes() {
    // Create quiz (admin/teachers only)
    this.router.post("/", 
      checkToken, 
      isAdmin, 
      //quizCreateValidation,
      validationHandlerMiddleware,
      (req, res) => this.controller.create(req, res)
    );

    // Update quiz (admin/teachers only)
    this.router.put("/:id", 
      checkToken, 
      isAdmin, 
      //    quizUpdateValidation,
      validationHandlerMiddleware,
      (req, res) => this.controller.update(req, res)
    );

    // Delete quiz (admin/teachers only)
    this.router.delete("/:id", 
      checkToken, 
      isAdmin, 
      (req, res) => this.controller.delete(req, res)
    );
  }
}

const quizBasicControllersObject = new QuizControllerCustom(quizBasicCrudObject);
const quizBasicRoutesObject = new QuizRoutesCustom(quizBasicControllersObject);

module.exports = quizBasicRoutesObject.getRouter();
