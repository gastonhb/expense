const BaseReadOnlyService = require('./BaseReadOnlyService');
const { NotFoundServiceError } = require('./errors');

class BaseService extends BaseReadOnlyService {
  constructor(model, entityName) {
    super(model, entityName);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const document = await this.model.findByPk(id);

    if (!document) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    await document.update(data);
    return document;
  }

  async delete(id) {
    const document = await this.model.findByPk(id);

    if (!document) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    await document.destroy();
    return document;
  }

  // Métodos adicionales comunes en la industria
  async save(data, id = null) {
    if (id) {
      return await this.update(id, data);
    }
    return await this.create(data);
  }

  async upsert(filters, data) {
    const existing = await this.findOne(filters);
    if (existing) {
      return await this.update(existing.id, data);
    }
    return await this.create({ ...filters, ...data });
  }

  async bulkCreate(dataArray) {
    return await this.model.bulkCreate(dataArray, { returning: true });
  }

  async bulkUpdate(filter, update) {
    return await this.model.update(update, { where: filter });
  }

  async bulkDelete(filter) {
    return await this.model.destroy({ where: filter });
  }
}

module.exports = BaseService;
