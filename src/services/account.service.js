const { Account } = require('../models');
const BaseService = require('./BaseService');
const sequelize = require('../config/database').getSequelize();

class AccountService extends BaseService {
  constructor() {
    super(Account, 'Account');
    this.defaultSort = 'name';
    this.textSearchFields = ['name', 'description', 'currency'];
  }

  async find(filters = {}, options = {}, reqUser = null) {
    const scopedFilters = reqUser?.id ? { ...filters, userId: reqUser.id } : filters;
    return await super.find(scopedFilters, options);
  }

  async findById(id, options = {}, reqUser = null) {
    if (reqUser?.id) {
      return await this.findOne({ id, userId: reqUser.id }, options);
    }
    return await super.findById(id, options);
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
    data.userId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new AccountService();
