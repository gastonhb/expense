const { Type } = require('../models');
const BaseService = require('./BaseService');

class TypeService extends BaseService {
  constructor() {
    super(Type, 'Type');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }
}

module.exports = new TypeService();
