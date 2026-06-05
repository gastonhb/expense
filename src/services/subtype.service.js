const { Subtype, Type } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const typeService = require('./type.service');

class SubtypeService extends BaseService {
  constructor() {
    super(Subtype, 'Subtype');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }

  getFindIncludes() {
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

  async create(data, reqUser) {
    await this.validateType(data.typeId, reqUser);
    return await super.create(data, reqUser);
  }

  async update(id, data, reqUser) {
    if (data.typeId) {
      await this.validateType(data.typeId, reqUser);
    }

    return await super.update(id, data, reqUser);
  }
}

module.exports = new SubtypeService();
