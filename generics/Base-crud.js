// Base CRUD operations class that can be used with any model
class BaseCRUD {
  constructor(model) {
    this.model = model;
  }
  // Create new record
  async create(data) {
    return await this.model.create(data);
  }
  async createMany(data) {
    return await this.model.insertMany(data);
  }
  // Get all records
  async getAll() {
    return await this.model.find();
  }
  async getAllPopulate(populate = null) {
    return await this.model.find().populate(populate);
  }

  // Get single record by ID
  async getById(id) {
    return await this.model.findById(id);
  }
  // Update record by ID
  async update(id, data, projection = null) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      select: projection,
    });
  }
  // Delete record by ID
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  // Update multiple records by condition
  async updateMany(filter, data) {
    return await this.model.updateMany(filter, data);
  }

  async deleteMany(filter) {
    return await this.model.deleteMany(filter);
  }
  async filterBy(filter, projection = null) {
    return await this.model.find(filter, projection);
  }

  async filterOneBy(filter, projection = null) {
    return await this.model.findOne(filter, projection);
  }

  async getWithQuery({
    filter = {},
    page = 1,
    limit = 10,
    skip = null,
    sort = { createdAt: -1 },
    projection = null,
  }) {
    const query = this.model.find(filter, projection).sort(sort);

    const realSkip = skip !== null ? skip : (page - 1) * limit;
    query.skip(realSkip).limit(limit);

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}

module.exports = BaseCRUD;
