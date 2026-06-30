const { Budget, Type, Subtype } = require('../models');
const BaseService = require('./BaseService');
const subtypeService = require('./subtype.service');
const typeService = require('./type.service');
const expenseService = require('./expense.service');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

class BudgetService extends BaseService {
  constructor() {
    super(Budget, 'Budget');
    this.defaultSort = '-date';
    this.dateRangeFields = ['date'];
  }

  get findIncludes() {
    return [
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

  async validateType(typeId, user, { transaction }) {
    if (!typeId) {
      return;
    }

    await typeService.findById(typeId, user, { transaction });
  }

  async validateSubtypeType(subtypeId, user, { transaction }) {
    if (!subtypeId) {
      return;
    }

    await subtypeService.findById(subtypeId, user, { transaction });
  }

  async create(data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { transaction });
      });
    };
    if (data.typeId) {
      await this.validateType(data.typeId, reqUser, { transaction });
    }

    if (data.subtypeId) {
      await this.validateSubtypeType(data.subtypeId, reqUser, { transaction });
    }
    data.userId = reqUser.id;

    return await super.create(data, reqUser, { transaction });
  }

  async update(id, data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.update(id, data, reqUser, { transaction });
      });
    };
    await this.findById(id, reqUser);

    if (data.typeId) {
      await this.validateType(data.typeId, reqUser,  { transaction });
    }

    if (data.subtypeId) {
      await this.validateSubtypeType(data.subtypeId, reqUser,  { transaction });
    }
    data.userId = reqUser.id;

    return await super.update(id, data, reqUser, { transaction });
  }

  async payBudget(budgetId, data, reqUser, options = {}) {
    const { transaction } = options;

    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.payBudget(budgetId, data, reqUser, { transaction });
      });
    }

    // Obtener el budget
    const budget = await this.findById(budgetId, {
      transaction
    });

    if (!budget) {
      throw new ServiceError('Budget not found');
    }

    if (budget.userId !== reqUser.id) {
      throw new ServiceError('Unauthorized - Budget does not belong to user');
    }

    if (budget.expenseId) {
      throw new ServiceError('Budget already paid');
    }

    // Preparar datos del expense
    const expenseAmount = data.amount ? parseFloat(data.amount) : parseFloat(budget.amount);
    const expenseData = {
      date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      amount: expenseAmount,
      typeId: data.typeId || budget.typeId || null,
      subtypeId: data.subtypeId || budget.subtypeId || null,
      paymentMethodId: data.paymentMethodId || null,
      description: data.description || budget.description,
      userId: reqUser.id
    };

    // Crear el expense
    const expense = await expenseService.create(expenseData, reqUser, { transaction });

    // Actualizar el budget con el expenseId y el monto si cambió
    const updateData = {
      expenseId: expense.id,
      updatedBy: reqUser.id
    };
    if (data.amount) {
      updateData.amount = expenseAmount;
    }

    return await budget.update(updateData, { transaction });
  }
}

module.exports = new BudgetService();
