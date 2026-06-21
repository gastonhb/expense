const { IncomeType } = require('../models');
const BaseService = require('./BaseService');

class IncomeTypeService extends BaseService {
  constructor() {
    super(IncomeType, 'IncomeType');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }

  async create(data, reqUser, options = {}) {
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.userId  = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new IncomeTypeService();
