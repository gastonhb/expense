const { Budget, MonthlyBudget } = require('../models');
const BaseService = require('./BaseService');
const budgetService = require('./budget.service.js');
const { ServiceError } = require('./errors');
const sequelize = require('../config/database').getSequelize();

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

    const nextMonthDate = new Date(lastMonthlyBudget.date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    const monthlyBudgetBody = {
      date: nextMonthDate,
      userId: reqUser.id
    };

    const monthlyBudget = await this.create(monthlyBudgetBody, reqUser, { transaction });

    if (lastMonthlyBudget.budgets && lastMonthlyBudget.budgets.length > 0) {
      const budgetsBody = lastMonthlyBudget.budgets.map(budget => {
        const budgetDate = new Date(budget.date);
        budgetDate.setMonth(budgetDate.getMonth() + 1);

        return {
          description: budget.description,
          amount: budget.amount,
          date: budgetDate,
          monthlyBudgetId: monthlyBudget.id,
          typeId: budget.typeId,
          subTypeId: budget.subTypeId,
          createdBy: reqUser.id,
          updatedBy: reqUser.id
        };
      });
      await budgetService.bulkCreate(budgetsBody, reqUser, { transaction });
    }

    return monthlyBudget;
  }

  async update(id, data, reqUser, options = {}) {
    data.userId  = reqUser.id;
    return await super.update(id, data, reqUser, options);
  }
}

module.exports = new MonthlyBudgetService();
