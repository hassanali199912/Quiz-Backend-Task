const ResponseHandler = require("../utils/ResponseHandler");

class BaseController {
    constructor(service) {
        this.service = service;
    }

    async create(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.create(req.body);
            response.success(data, "Record created successfully", 201);
        } catch (error) {
            response.validationError(error.message);
        }
    }

    async getAll(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.getAll();
            response.success(data, "Records retrieved successfully");
        } catch (error) {
            response.error(error.message);
        }
    }

    async getById(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.getById(req.params.id);
            if (!data) return response.notFound();
            response.success(data, "Record retrieved successfully");
        } catch (error) {
            response.error(error.message);
        }
    }

    async update(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.update(req.params.id, req.body);
            if (!data) return response.notFound();
            response.success(data, "Record updated successfully");
        } catch (error) {
            response.validationError(error.message);
        }
    }

    async delete(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.delete(req.params.id);
            if (!data) return response.notFound();
            response.success(null, "Record deleted successfully");
        } catch (error) {
            response.error(error.message);
        }
    }

    async filter(req, res) {
        const response = new ResponseHandler(res);
        try {
            const data = await this.service.filterBy(req.query);
            response.success(data, "Filtered records retrieved successfully");
        } catch (error) {
            response.error(error.message);
        }
    }
}

module.exports = BaseController;
