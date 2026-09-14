const { Subtype, Type } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const typeService = require('./type.service');
const sequelize = require('../config/database').getSequelize();

class SubtypeService extends BaseService {
  constructor() {
    super(Subtype, 'Subtype');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }

  get findIncludes() {
    return [{
      model: Type,
      as: 'type'
    }];
  }

  async validateType(typeId, user) {
    if (!typeId) {
      return;
    }
    const type = await typeService.findOne({ id: typeId }, user);

    if (!type) {
      throw new ServiceError('The provided type does not exist for this user.');
    }
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    await this.validateType(data.typeId, reqUser);
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser) {
    if (data.typeId) {
      await this.validateType(data.typeId, reqUser);
    }
    data.userId = reqUser.id;

    return await super.update(id, data, reqUser);
  }
}

module.exports = new SubtypeService();
