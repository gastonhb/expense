const { Shopping } = require('../models');
const BaseService = require('./BaseService');
const quotaService = require('./quota.service');
const sequelize = require('../config/database').getSequelize();

class ShoppingService extends BaseService {
  constructor() {
    super(Shopping, 'Shopping');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['description'];
    this.dateRangeFields = ['date', 'dueDate'];
  }

  get findIncludes() {
    return [
      {
        model: quotaService.model,
        as: 'quotas'
      }
    ];
  }

  calculateQuotaDate(baseDate, quotaNumber) {
    const date = new Date(baseDate);
    date.setUTCMonth(date.getUTCMonth() + (quotaNumber - 1));
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async create(data, reqUser, { transaction } = {}) {
    if (!transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { transaction });
      });
    }

    const shoppingBody = {
      date: data.date,
      dueDate: data.dueDate,
      description: data.description,
      amount: data.amount,
      quotasCount: data.quotasCount,
      userId: reqUser.id
    };
    const shopping = await super.create(shoppingBody, reqUser, { transaction });

    // Create quotas for this shopping
    const quotas = [];
    const amountPerQuota = (parseFloat(data.amount) / data.quotasCount).toFixed(2);

    for (let i = 1; i <= data.quotasCount; i++) {
      quotas.push({
        date: this.calculateQuotaDate(data.dueDate, i),
        amount: amountPerQuota,
        number: `${i}`,
        userId: reqUser.id,
        shoppingId: shopping.id,
        createdBy: reqUser.id,
        updatedBy: reqUser.id
      });
    }

    await quotaService.bulkCreate(quotas, reqUser, { transaction });

    return shopping;
  }
}

module.exports = new ShoppingService();
