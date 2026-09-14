const { DebtPayment } = require('../models');
const BaseService = require('./BaseService');
const sequelize = require('../config/database').getSequelize();

class DebtPaymentService extends BaseService {
  constructor() {
    super(DebtPayment, 'DebtPayment');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  get findIncludes() {
    return [
      { model: require('../models').Debtor, as: 'debtor' }
    ];
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    data.ownerUserId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async update(id, data, reqUser, options = {}) {
    data.ownerUserId = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new DebtPaymentService();
