const { Budget, Type, Subtype } = require('../models');
const BaseService = require('./BaseService');
const subtypeService = require('./subtype.service');
const typeService = require('./type.service');
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
}

module.exports = new BudgetService();
