const { IncomeType } = require('../models');
const BaseService = require('./BaseService');
const sequelize = require('../config/database').getSequelize();

class IncomeTypeService extends BaseService {
  constructor() {
    super(IncomeType, 'IncomeType');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.userId  = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new IncomeTypeService();
