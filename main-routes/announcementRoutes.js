const announcementModule = require("../models/announcement");
const announcementBasicCrud = require("../generics/Base-crud");
const announcementBasicControllers = require("../generics/Base-Controller");
const announcementBasicRoutes = require("../generics/Base-Routes");

const announcementBasicCrudObject = new announcementBasicCrud(
  announcementModule
);

// Middleware For Protected Routes
const checkToken = require("../middlewares/CheckToken.middleware");
const isAdmin = require("../middlewares/IsAdmin.middleware");

class AnnouncementRoutesCustom extends announcementBasicRoutes {
  constructor(controller) {
    super(controller);
  }

  mainRoutes() {
    this.protectedRoutes();
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

const announcementBasicControllersObject = new announcementBasicControllers(
  announcementBasicCrudObject
);
const announcementBasicRoutesObject = new AnnouncementRoutesCustom(
  announcementBasicControllersObject
);

module.exports = announcementBasicRoutesObject.getRouter();
