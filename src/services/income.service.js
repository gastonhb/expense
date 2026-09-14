const { Income, IncomeType } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const incomeTypeService = require('./incomeType.service');
const sequelize = require('../config/database').getSequelize();

class IncomeService extends BaseService {
  constructor() {
    super(Income, 'Income');
    this.defaultSort = '-createdAt';
  }

  get findIncludes() {
    return [{
      model: IncomeType,
      as: 'incomeType'
    }];
  }

  async validateIncomeType(incomeTypeId, user) {
    if (!incomeTypeId) {
      return;
    }
    const incomeType = await incomeTypeService.findOne({ id: incomeTypeId }, user);

    if (!incomeType) {
      throw new ServiceError('The provided income type does not exist for this user.');
    }
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    await this.validateIncomeType(data.incomeTypeId, reqUser);
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    if (data.incomeTypeId) {
      await this.validateIncomeType(data.incomeTypeId, reqUser);
    }
    data.userId = reqUser.id;

    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new IncomeService();
