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

  async validateType(typeId, userId) {
    if (!typeId) {
      return;
    }

    await typeService.findById(typeId, { userId });
  }

  async validateSubtypeType(typeId, subtypeId, userId) {
    if (!typeId || !subtypeId) {
      return;
    }

    const subtype = await subtypeService.findById(subtypeId, { userId });

    if (subtype.typeId !== typeId) {
      throw new ServiceError('The provided subtype does not belong to the specified type.');
    }
  }

  async validatePaymentMethod(paymentMethodId, userId) {
    if (!paymentMethodId) {
      return;
    }

    await paymentMethodService.findById(paymentMethodId, { userId });
  }

  async create(data, reqUser) {
    await this.validatePaymentMethod(data.paymentMethodId, reqUser.id);
    await this.validateType(data.typeId, reqUser.id);

    if (data.typeId && data.subtypeId) {
      await this.validateSubtypeType(data.typeId, data.subtypeId, reqUser.id);
    }

    return await super.create(data, reqUser);
  }

  async update(id, data, reqUser) {
    if (data.typeId || data.subtypeId || data.paymentMethodId) {
      const expense = await this.findById(id, reqUser);

      const paymentMethodId = data.paymentMethodId !== undefined ? data.paymentMethodId : expense.paymentMethodId;
      await this.validatePaymentMethod(paymentMethodId, reqUser.id);

      const typeId = data.typeId !== undefined ? data.typeId : expense.typeId;
      const subtypeId = data.subtypeId !== undefined ? data.subtypeId : expense.subtypeId;

      await this.validateType(typeId, reqUser.id);

      if (typeId && subtypeId) {
        await this.validateSubtypeType(typeId, subtypeId, reqUser.id);
      }
    }
    return await super.update(id, data, reqUser);
  }
}

module.exports = new ExpenseService();
