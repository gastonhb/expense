const { User } = require('../models');
const BaseService = require('./BaseService');
const sequelize = require('../config/database').getSequelize();

class UserService extends BaseService {
  constructor() {
    super(User, 'User');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'lastName', 'email', 'authenticationId'];
  }

  async create(data, reqUser, options = {}) {
    if (!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        return await this.create(data, reqUser, { ...options, transaction });
      });
    }

    if (reqUser?.id) {
      return await super.create(data, reqUser, options);
    }

    const user = await this.model.create(data, { transaction: options.transaction });

    return await user.update({
      createdBy: user.id,
      updatedBy: user.id
    }, { transaction: options.transaction });
  }
}

module.exports = new UserService();
