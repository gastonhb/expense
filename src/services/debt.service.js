const { Debt } = require('../models');
const BaseService = require('./BaseService');

class DebtService extends BaseService {
  constructor() {
    super(Debt, 'Debt');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  get findIncludes() {
    return [
      { model: require('../models').Debtor, as: 'debtor' }
    ];
  }

  async create(data, reqUser, options = {}) {
    data.ownerUserId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.ownerUserId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new DebtService();
