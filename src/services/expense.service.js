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

  get findIncludes() {
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

  async validateType(typeId, user, { transaction } = {}) {
    if (!typeId) {
      return;
    }

    await typeService.findById(typeId, user, { transaction });
  }

  async validateSubtypeType(typeId, subtypeId, user, { transaction } = {}) {
    if (!typeId || !subtypeId) {
      return;
    }

    const subtype = await subtypeService.findById(subtypeId, user, { transaction });

    if (subtype.typeId !== typeId) {
      throw new ServiceError('The provided subtype does not belong to the specified type.');
    }
  }

  async validatePaymentMethod(paymentMethodId, user, { transaction } = {}) {
    if (!paymentMethodId) {
      return;
    }

    await paymentMethodService.findById(paymentMethodId, user, { transaction });
  }

  async create(data, reqUser, { transaction } = {}) {
    await this.validatePaymentMethod(data.paymentMethodId, reqUser, { transaction });
    await this.validateType(data.typeId, reqUser, { transaction });

    if (data.typeId && data.subtypeId) {
      await this.validateSubtypeType(data.typeId, data.subtypeId, reqUser, { transaction });
    }
    data.userId = reqUser.id;

    return await super.create(data, reqUser, { transaction });
  }

  async update(id, data, reqUser, { transaction } = {}) {
    if (data.typeId || data.subtypeId || data.paymentMethodId) {
      const expense = await this.findById(id, reqUser);

      const paymentMethodId = data.paymentMethodId !== undefined ? data.paymentMethodId : expense.paymentMethodId;
      await this.validatePaymentMethod(paymentMethodId, reqUser, { transaction });

      const typeId = data.typeId !== undefined ? data.typeId : expense.typeId;
      const subtypeId = data.subtypeId !== undefined ? data.subtypeId : expense.subtypeId;

      await this.validateType(typeId, reqUser, { transaction });

      if (typeId && subtypeId) {
        await this.validateSubtypeType(typeId, subtypeId, reqUser, { transaction });
      }
    }
    data.userId = reqUser.id;

    return await super.update(id, data, reqUser, { transaction });
  }
}

module.exports = new ExpenseService();
