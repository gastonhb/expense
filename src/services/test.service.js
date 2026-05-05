const { Test } = require('../models');
const BaseService = require('./BaseService');

class TestService extends BaseService {
  constructor() {
    super(Test, 'Test');
    this.defaultSort = 'createdAt';
  }

  // Sobrescribir el método de filtros personalizados
  buildCustomFilters(filters) {
    const searchFilters = {};

    // Búsqueda por nombre (case-insensitive)
    if (filters.name) {
      Object.assign(searchFilters, this.textSearch(['name'], filters.name));
    }

    return searchFilters;
  }

}

module.exports = new TestService();
