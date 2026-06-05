const { Expense, PaymentMethod, Type, Subtype } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const paymentMethodService = require('./paymentMethod.service');
const subtypeService = require('./subtype.service');
const typeService = require('./type.service');

class ExpenseService extends BaseService {
  constructor() {
    super(Expense, 'Expense');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  getFindIncludes() {
    return [
      {
        model: PaymentMethod,
        as: 'paymentMethod'
      },
      {
        model: Type,
        as: 'type'
      },
      {
        model: Subtype,
        as: 'subtype'
      }
    ];
  }

  async validateType(typeId, user) {
    if (!typeId) {
      return;
    }

    await typeService.findById(typeId, user);
  }

  async validateSubtypeType(typeId, subtypeId, user) {
    if (!typeId || !subtypeId) {
      return;
    }

    const subtype = await subtypeService.findById(subtypeId, user);

    if (subtype.typeId !== typeId) {
      throw new ServiceError('The provided subtype does not belong to the specified type.');
    }
  }

  async validatePaymentMethod(paymentMethodId, user) {
    if (!paymentMethodId) {
      return;
    }

    await paymentMethodService.findById(paymentMethodId, user);
  }

  async create(data, reqUser) {
    await this.validatePaymentMethod(data.paymentMethodId, reqUser);
    await this.validateType(data.typeId, reqUser);

    if (data.typeId && data.subtypeId) {
      await this.validateSubtypeType(data.typeId, data.subtypeId, reqUser);
    }

    return await super.create(data, reqUser);
  }

  async update(id, data, reqUser) {
    if (data.typeId || data.subtypeId || data.paymentMethodId) {
      const expense = await this.findById(id, reqUser);

      const paymentMethodId = data.paymentMethodId !== undefined ? data.paymentMethodId : expense.paymentMethodId;
      await this.validatePaymentMethod(paymentMethodId, reqUser);

      const typeId = data.typeId !== undefined ? data.typeId : expense.typeId;
      const subtypeId = data.subtypeId !== undefined ? data.subtypeId : expense.subtypeId;

      await this.validateType(typeId, reqUser);

      if (typeId && subtypeId) {
        await this.validateSubtypeType(typeId, subtypeId, reqUser);
      }
    }
    return await super.update(id, data, reqUser);
  }
}

module.exports = new ExpenseService();
