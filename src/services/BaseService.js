const BaseReadOnlyService = require('./BaseReadOnlyService');
const { NotFoundServiceError, UnauthorizedServiceError } = require('./errors');

class BaseService extends BaseReadOnlyService {
  constructor(model, entityName) {
    super(model, entityName);
  }

  sanitizeWriteData(data = {}) {
    const sanitized = { ...data };

    delete sanitized.createdBy;
    delete sanitized.updatedBy;

    if (this.model.rawAttributes.userId) {
      delete sanitized.userId;
    }

    return sanitized;
  }

  buildCreateData(data, reqUser) {
    const sanitizedData = this.sanitizeWriteData(data);
    const createData = {
      ...sanitizedData,
      createdBy: reqUser?.id ?? null,
      updatedBy: reqUser?.id ?? null
    };

    if (this.model.rawAttributes.userId) {
      if (!reqUser?.id) {
        throw new UnauthorizedServiceError('Debes estar autenticado para crear este recurso', 'create');
      }

      createData.userId = reqUser.id;
    }

    return createData;
  }

  async create(data, reqUser) {
    return await this.model.create(this.buildCreateData(data, reqUser));
  }

  async update(id, data, reqUser) {
    const element = await this.findById(id, reqUser);

    if (!element) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    const sanitizedData = this.sanitizeWriteData(data);

    return await element.update({
      ...sanitizedData,
      updatedBy: reqUser?.id ?? null
    });
  }

  async delete(id, reqUser) {
    const element = await this.findById(id, reqUser);

    if (!element) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    return await element.destroy();
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
