const { Budget, MonthlyBudget, Quota } = require('../models');
const BaseService = require('./BaseService');
const budgetService = require('./budget.service.js');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();
const { Op } = require('sequelize');

class MonthlyBudgetService extends BaseService {
  constructor() {
    super(MonthlyBudget, 'MonthlyBudget');
    this.defaultSort = '-createdAt';
  }

  get findIncludes() {
    return [
      {
        model: Budget,
        as: 'budgets'
      },
      {
        model: Quota,
        as: 'quotas'
      }
    ];
  }

  async create(data, reqUser, options = {}) {
    data.userId = reqUser.id;
    return await super.create(data, reqUser, options);
  }

  async copyLastMonth(reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.copyLastMonth(reqUser, { transaction });
      });
    }
    const include = [{
      model: Budget,
      as: 'budgets'
    }];

    const lastMonthlyBudget = await this.findOne({ userId: reqUser.id }, { _order: '-date', include, transaction });
    if(!lastMonthlyBudget) {
      throw new ServiceError('There is not budgets');
    }

    const nextMonthDate = new Date(lastMonthlyBudget.date + 'T00:00:00Z');
    nextMonthDate.setUTCMonth(nextMonthDate.getUTCMonth() + 1);
    const year = nextMonthDate.getUTCFullYear();
    const month = String(nextMonthDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(nextMonthDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const monthlyBudgetBody = {
      date: formattedDate,
      userId: reqUser.id
    };

    const monthlyBudget = await this.create(monthlyBudgetBody, reqUser, { transaction });

    // Copiar budgets del mes anterior
    if (lastMonthlyBudget.budgets && lastMonthlyBudget.budgets.length > 0) {
      const budgetsBody = lastMonthlyBudget.budgets.map(budget => {
        const budgetDate = new Date(budget.date + 'T00:00:00Z');
        budgetDate.setUTCMonth(budgetDate.getUTCMonth() + 1);
        const bYear = budgetDate.getUTCFullYear();
        const bMonth = String(budgetDate.getUTCMonth() + 1).padStart(2, '0');
        const bDay = String(budgetDate.getUTCDate()).padStart(2, '0');
        const bDate = `${bYear}-${bMonth}-${bDay}`;

        return {
          description: budget.description,
          amount: budget.amount,
          date: bDate,
          monthlyBudgetId: monthlyBudget.id,
          typeId: budget.typeId,
          subtypeId: budget.subtypeId,
          userId: reqUser.id,
          createdBy: reqUser.id,
          updatedBy: reqUser.id
        };
      });
      await budgetService.bulkCreate(budgetsBody, reqUser, { transaction });
    }

    // Buscar y asignar cuotas del mismo mes al presupuesto
    const monthStart = `${year}-${month}-01`;
    const monthEnd = new Date(nextMonthDate.getUTCFullYear(), nextMonthDate.getUTCMonth() + 1, 0);
    const mEnd = String(monthEnd.getUTCMonth() + 1).padStart(2, '0');
    const dEnd = String(monthEnd.getUTCDate()).padStart(2, '0');
    const monthEndStr = `${nextMonthDate.getUTCFullYear()}-${mEnd}-${dEnd}`;

    await Quota.update(
      {
        monthlyBudgetId: monthlyBudget.id,
        updatedBy: reqUser.id
      },
      {
        where: {
          userId: reqUser.id,
          monthlyBudgetId: null,
          date: {
            [Op.gte]: monthStart,
            [Op.lte]: monthEndStr
          }
        },
        transaction
      }
    );

    return monthlyBudget;
  }

  async update(id, data, reqUser, options = {}) {
    data.userId  = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new MonthlyBudgetService();
