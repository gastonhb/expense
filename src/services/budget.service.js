const { Budget, Type, Subtype, Quota } = require('../models');
const BaseService = require('./BaseService');
const { Op } = require('sequelize');
const subtypeService = require('./subtype.service');
const typeService = require('./type.service');
const expenseService = require('./expense.service');
const quotaService = require('./quota.service');
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
      },
      {
        model: Quota,
        as: 'quotas'
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

  async validateQuota(quotaId, user, { transaction } = {}) {
    if (!quotaId) {
      return;
    }

    const quota = await quotaService.findById(quotaId, user, { transaction });
    if (quota.userId !== user.id) {
      throw new ServiceError('Unauthorized - Quota does not belong to user');
    }
    if (quota.expenseId) {
      throw new ServiceError('Quota is already paid');
    }
  }

  async validateQuotas(quotaIds, user, { transaction } = {}) {
    if (!quotaIds || !Array.isArray(quotaIds) || quotaIds.length === 0) {
      return;
    }

    await Promise.all(quotaIds.map((quotaId) => this.validateQuota(quotaId, user, { transaction })));
  }

  async attachQuotasToBudget(budgetId, quotaIds, reqUser, { transaction } = {}) {
    if (!quotaIds || !Array.isArray(quotaIds) || quotaIds.length === 0) {
      return;
    }

    await quotaService.model.update(
      {
        budgetId,
        updatedBy: reqUser.id
      },
      {
        where: {
          id: quotaIds,
          userId: reqUser.id
        },
        transaction
      }
    );
  }

  async syncBudgetQuotas(budgetId, quotaIds, reqUser, { transaction } = {}) {
    if (!Array.isArray(quotaIds)) {
      return;
    }

    await quotaService.model.update(
      {
        budgetId: null,
        updatedBy: reqUser.id
      },
      {
        where: {
          budgetId,
          id: {
            [Op.notIn]: quotaIds
          }
        },
        transaction
      }
    );

    await this.attachQuotasToBudget(budgetId, quotaIds, reqUser, { transaction });
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

    if (data.quotaIds) {
      await this.validateQuotas(data.quotaIds, reqUser, { transaction });
    }
    data.userId = reqUser.id;

    const budget = await super.create(data, reqUser, { transaction });
    if (data.quotaIds) {
      await this.attachQuotasToBudget(budget.id, data.quotaIds, reqUser, { transaction });
    }

    return budget;
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
    if (data.quotaIds) {
      await this.validateQuotas(data.quotaIds, reqUser, { transaction });
    }
    data.userId = reqUser.id;

    const budget = await super.update(id, data, reqUser, { transaction });
    if (data.quotaIds) {
      await this.syncBudgetQuotas(budget.id, data.quotaIds, reqUser, { transaction });
    }

    return budget;
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

    // Si hay cuotas vinculadas a este presupuesto, marcar todas las cuotas impagas como pagadas con el mismo expense
    await quotaService.model.update(
      {
        expenseId: expense.id,
        updatedBy: reqUser.id
      },
      {
        where: {
          budgetId: budget.id,
          userId: reqUser.id,
          expenseId: null
        },
        transaction
      }
    );

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
