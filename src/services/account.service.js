const { Account } = require('../models');
const BaseService = require('./BaseService');

class AccountService extends BaseService {
  constructor() {
    super(Account, 'Account');
    this.defaultSort = 'name';
    this.textSearchFields = ['name', 'description', 'currency'];
  }

  async create(data, reqUser, options = {}) {
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.userId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new AccountService();
