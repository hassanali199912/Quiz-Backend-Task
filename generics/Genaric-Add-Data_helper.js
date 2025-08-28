const ResponseHandler = require("../utils/ResponseHandler");
const BASIC_CRUD = require("./Base-crud");

// Import all models
const ItemModel = require("../models/item");
const CategoryModel = require("../models/category");
const MenuModel = require("../models/menu");
const RestaurantModel = require("../models/restaurant");
const UserModel = require("../models/users");

// Model mapping
const modelMap = {
  item: ItemModel,
  category: CategoryModel,
  menu: MenuModel,
  restaurant: RestaurantModel,
  user: UserModel,
};

const bulkCreate = async (req, res) => {
  const responseHandler = new ResponseHandler(res);

  try {
    const { data, moduleName } = req.body;

    // Validate required fields
    if (!data || !Array.isArray(data) || data.length === 0) {
      return responseHandler.error(
        "Data array is required and must not be empty",
        400
      );
    }

    if (!moduleName || typeof moduleName !== "string") {
      return responseHandler.error(
        "Module name is required and must be a string",
        400
      );
    }

    // Get the model from the map
    const Model = modelMap[moduleName.toLowerCase()];
    if (!Model) {
      return responseHandler.error(
        `Invalid module name. Available modules: ${Object.keys(modelMap).join(
          ", "
        )}`,
        400
      );
    }

    const ModuleCRUD = new BASIC_CRUD(Model);
    const createBulk = await ModuleCRUD.createMany(data);
    return responseHandler.success(createBulk, `Bulks Created Successfully`);
  } catch (error) {
    return responseHandler.error(error.message, 500, error);
  }
};

module.exports = {
  bulkCreate,
};
