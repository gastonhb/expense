const { PaymentMethod } = require('../models');
const BaseService = require('./BaseService');

class PaymentMethodService extends BaseService {
  constructor() {
    super(PaymentMethod, 'PaymentMethod');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }
}

module.exports = new PaymentMethodService();