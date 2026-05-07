const { Expense } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const paymentMethodService = require('./paymentMethod.service');
const subtypeService = require('./subtype.service');

class ExpenseService extends BaseService {
  constructor() {
    super(Expense, 'Expense');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  async validateSubtypeType(typeId, subtypeId) {
    if (!typeId || !subtypeId) {
      return;
    }

    const subtype = await subtypeService.findById(subtypeId);

    if (subtype.typeId !== typeId) {
      throw new ServiceError('The provided subtype does not belong to the specified type.');
    }
  }

  async validatePaymentMethod(paymentMethodId) {
    if (!paymentMethodId) {
      return;
    }

    await paymentMethodService.findById(paymentMethodId);
  }

  async create(data) {
    await this.validatePaymentMethod(data.paymentMethodId);

    if (data.typeId && data.subtypeId) {
      await this.validateSubtypeType(data.typeId, data.subtypeId);
    }

    return await super.create(data);
  }

  async update(id, data) {
    if (data.typeId || data.subtypeId || data.paymentMethodId) {
      const expense = await this.findById(id);

      const paymentMethodId = data.paymentMethodId !== undefined ? data.paymentMethodId : expense.paymentMethodId;
      await this.validatePaymentMethod(paymentMethodId);

      const typeId = data.typeId !== undefined ? data.typeId : expense.typeId;
      const subtypeId = data.subtypeId !== undefined ? data.subtypeId : expense.subtypeId;

      if (typeId && subtypeId) {
        await this.validateSubtypeType(typeId, subtypeId);
      }
    }
    return await super.update(id, data);
  }
}

module.exports = new ExpenseService();
