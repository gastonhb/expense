const { Account, AccountStatus } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

class AccountStatusService extends BaseService {
  constructor() {
    super(AccountStatus, 'AccountStatus');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  get findIncludes() {
    return [{
      model: Account,
      as: 'account'
    }];
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

  async validateAccount(accountId, reqUser, transaction) {
    const account = await Account.findOne({
      where: { id: accountId, userId: reqUser.id },
      transaction
    });

    if (!account) {
      throw new ServiceError('The provided account does not exist for this user.');
    }
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    const { transaction } = options;
    await this.validateAccount(data.accountId, reqUser, transaction);
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    const { transaction } = options;
    const status = await this.findById(id, { transaction });
    const accountId = data.accountId || status.accountId;
    await this.validateAccount(accountId, reqUser, transaction);

    data.accountId = accountId;
    data.userId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new AccountStatusService();
