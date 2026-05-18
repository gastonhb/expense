const { User } = require('../models');
const BaseService = require('./BaseService');

class UserService extends BaseService {
  constructor() {
    super(User, 'User');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'lastName', 'email', 'authenticationId'];
  }

  async create(data, reqUser) {
    if (reqUser?.id) {
      return await super.create(data, reqUser);
    }

    const user = await this.model.create(data);

    return await user.update({
      createdBy: user.id,
      updatedBy: user.id
    });
  }
}

module.exports = new UserService();
