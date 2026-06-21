const { PaymentMethod } = require('../models');
const BaseService = require('./BaseService');

class PaymentMethodService extends BaseService {
  constructor() {
    super(PaymentMethod, 'PaymentMethod');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
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

module.exports = new PaymentMethodService();
