const announcementModule = require("../models/announcement");
const announcementBasicCrud = require("../generics/Base-crud");
const announcementBasicControllers = require("../generics/Base-Controller");
const announcementBasicRoutes = require("../generics/Base-Routes");
const ResponseHandler = require("../utils/ResponseHandler");

const announcementBasicCrudObject = new announcementBasicCrud(announcementModule);

// Middleware For Protected Routes
const checkToken = require("../middlewares/CheckToken.middleware");
const isAdmin = require("../middlewares/IsAdmin.middleware");
//const { announcementCreateValidation, announcementUpdateValidation } = require("../middlewares/announcementValidation.middleware");
const validationHandlerMiddleware = require("../middlewares/ValidationHandlerMiddelware");

class AnnouncementControllerCustom extends announcementBasicControllers {
  constructor(controller) {
    super(controller);
  }

  // Override create method to add author field
  async create(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      // Add the user ID from the token
      req.body.author = req.userId;
      const data = await this.service.create(req.body);
      responseHandler.success(data, "Announcement created successfully", 201);
    } catch (error) {
      responseHandler.validationError(error.message);
    }
  }

  // Override getAll to sort by creation date and populate author
  async getAll(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const data = await this.service.getWithQuery({
        filter: { isActive: true },
        sort: { createdAt: -1 },
        populate: "author"
      });
      responseHandler.success(data, "Announcements retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Override getById to populate author
  async getById(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const data = await this.service.getByIdPopulate(req.params.id, "author");
      if (!data) return responseHandler.notFound("Announcement not found");
      responseHandler.success(data, "Announcement retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Override update to check authorization
  async update(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const announcement = await this.service.getById(req.params.id);
      if (!announcement) return responseHandler.notFound("Announcement not found");
      
      // Check if user is author or admin
      if (announcement.author.toString() !== req.userId && req.userRole !== "CODEMODE") {
        return responseHandler.error("Not authorized to update this announcement", 401);
      }
      
      const data = await this.service.update(req.params.id, req.body);
      responseHandler.success(data, "Announcement updated successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Override delete to check authorization
  async delete(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const announcement = await this.service.getById(req.params.id);
      if (!announcement) return responseHandler.notFound("Announcement not found");
      
      // Check if user is author or admin
      if (announcement.author.toString() !== req.userId && req.userRole !== "CODEMODE") {
        return responseHandler.error("Not authorized to delete this announcement", 401);
      }
      
      const data = await this.service.delete(req.params.id);
      responseHandler.success(null, "Announcement deleted successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Custom method to mark announcement as read
  async markAsRead(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const announcement = await this.service.getById(req.params.id);
      if (!announcement) return responseHandler.notFound("Announcement not found");
      
      await announcement.markAsRead(req.userId);
      responseHandler.success(announcement, "Announcement marked as read");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }

  // Custom method to get announcements by course
  async getByCourse(req, res) {
    const responseHandler = new ResponseHandler(res);
    try {
      const { course } = req.params;
      const data = await this.service.getWithQuery({
        filter: { course, isActive: true },
        sort: { createdAt: -1 },
        populate: "author"
      });
      responseHandler.success(data, "Course announcements retrieved successfully");
    } catch (error) {
      responseHandler.error(error.message);
    }
  }
}

class AnnouncementRoutesCustom extends announcementBasicRoutes {
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
    // Get all announcements
    this.router.get("/", 
      checkToken, 
      (req, res) => this.controller.getAll(req, res)
    );

    // Get single announcement
    this.router.get("/:id", 
      checkToken, 
      (req, res) => this.controller.getById(req, res)
    );

    // Get announcements by course
    this.router.get("/course/:course", 
      checkToken, 
      (req, res) => this.controller.getByCourse(req, res)
    );

    // Mark announcement as read
    this.router.post("/:id/read", 
      checkToken, 
      (req, res) => this.controller.markAsRead(req, res)
    );
  }

  // Protected routes (authenticated users can create, authors/admins can edit/delete)
  protectedRoutes() {
    // Create announcement (all authenticated users)
    this.router.post("/", 
      checkToken, 
      //announcementCreateValidation,
      validationHandlerMiddleware,
      (req, res) => this.controller.create(req, res)
    );

    // Update announcement (author or admin only)
    this.router.put("/:id", 
      checkToken, 
      //announcementUpdateValidation,
      validationHandlerMiddleware,
      (req, res) => this.controller.update(req, res)
    );

    // Delete announcement (author or admin only)
    this.router.delete("/:id", 
      checkToken, 
      (req, res) => this.controller.delete(req, res)
    );
  }
}

const announcementBasicControllersObject = new AnnouncementControllerCustom(announcementBasicCrudObject);
const announcementBasicRoutesObject = new AnnouncementRoutesCustom(announcementBasicControllersObject);

module.exports = announcementBasicRoutesObject.getRouter();
