const { Subtype, Type } = require('../models');
const BaseService = require('./BaseService');

class SubtypeService extends BaseService {
  constructor() {
    super(Subtype, 'Subtype');
    this.defaultSort = '-createdAt';
    this.textSearchFields = ['name', 'description'];
  }

  getFindIncludes() {
    return [{
      model: Type,
      as: 'type'
    }];
  }

}

module.exports = new SubtypeService();
