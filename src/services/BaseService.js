const BaseReadOnlyService = require('./BaseReadOnlyService');
const { NotFoundServiceError, UnauthorizedServiceError, ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

class BaseService extends BaseReadOnlyService {
  constructor(model, entityName) {
    super(model, entityName);
  }


  async create(data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { transaction });
      });
    };

    try {
      if (!reqUser?.id) {
        throw new UnauthorizedServiceError('Debes estar autenticado para crear este recurso', 'create');
      }

      return await this.model.create({
        ...data,
        createdBy: reqUser?.id,
        updatedBy: reqUser?.id
      }, { transaction });
    } catch (err) {
      throw new ServiceError(err);
    }
  }

  async update(id, data, reqUser, { transaction } = {}) {
    try {
      if (!transaction) {
        return await sequelize.transaction(async (transaction) => {
          return await this.update(id, data, reqUser, { transaction });
        });
      };

      if (!reqUser?.id) {
        throw new UnauthorizedServiceError('Debes estar autenticado para crear este recurso', 'create');
      }

      const element = await this.findById(id, { transaction });
      if (!element) {
        throw new NotFoundServiceError(this.entityName, id);
      }

      return await element.update({
        ...data,
        updatedBy: reqUser?.id
      }, { transaction });
    } catch (err) {
      throw new ServiceError(err);
    }
  }

  async delete(id, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.delete(id, { transaction });
      });
    };
    const element = await this.findById(id);
    if (!element) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    return await element.destroy();
  }
}

module.exports = BaseService;
