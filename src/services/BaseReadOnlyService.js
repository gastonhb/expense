const config = require('../config/environment');
const { Op } = require('sequelize');
const { NotFoundServiceError, ServiceError } = require('./errors');

class BaseReadOnlyService {
  constructor(model, entityName) {
    this.model = model;
    this.entityName = entityName;
  }

  /**
   * Helper para búsqueda de texto en múltiples campos
   * @param {Array} fields - Campos donde buscar
   * @param {String} searchTerm - Término de búsqueda
   * @returns {Object} Filtro Sequelize
   */
  textSearch(fields, searchTerm) {
    if (!searchTerm || !fields.length) return {};

    return {
      [Op.or]: fields.map((field) => ({
        [field]: {
          [Op.iLike]: `%${searchTerm}%`
        }
      }))
    };
  }

  /**
   * Helper para filtros de fecha
   * @param {String} field - Campo de fecha
   * @param {String} from - Fecha desde (ISO string)
   * @param {String} to - Fecha hasta (ISO string)
   * @returns {Object} Filtro Sequelize
   */
  dateFilter(field, from, to) {
    const filter = {};

    if (from || to) {
      filter[field] = {};
      if (from) filter[field][Op.gte] = new Date(from);
      if (to) filter[field][Op.lte] = new Date(to);
    }

    return filter;
  }

  async find(query = {}) {
    // Extraer parámetros de paginación y ordenamiento
    const { _page, _limit, _order, ...filters } = query;

    // Configurar paginación
    const page = parseInt(_page) || 1;
    const limit = Math.min(parseInt(_limit) || config.pagination.defaultPageSize, 100);

    // Validar página mínima
    if (page < 1) {
      throw new ServiceError('La página debe ser mayor a 0');
    }

    // Calcular skip
    const skip = (page - 1) * limit;

    const order = [];
    const validOrderFields = Object.keys(this.model.rawAttributes || {});

    if (_order) {
      const sortFields = _order.split(',').map((field) => field.trim()).filter(Boolean);

      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          const fieldName = field.substring(1);
          if (!validOrderFields.includes(fieldName)) {
            throw new ServiceError(`Campo de ordenamiento no valido: ${fieldName}`);
          }
          order.push([fieldName, 'DESC']);
        } else {
          if (!validOrderFields.includes(field)) {
            throw new ServiceError(`Campo de ordenamiento no valido: ${field}`);
          }
          order.push([field, 'ASC']);
        }
      });
    } else {
      const defaultSort = this.defaultSort || 'createdAt';
      if (validOrderFields.includes(defaultSort)) {
        order.push([defaultSort, 'DESC']);
      }
    }

    let searchFilters;
    if (this.buildCustomFilters && typeof this.buildCustomFilters === 'function') {
      searchFilters = this.buildCustomFilters(filters);
    } else {
      searchFilters = { ...filters };
      if (filters.name && this.model.rawAttributes?.name) {
        delete searchFilters.name;
        Object.assign(searchFilters, this.textSearch(['name'], filters.name));
      }
    }

    const findOptions = {
      where: searchFilters,
      offset: skip,
      limit,
      order
    };

    if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    const { rows: docs, count } = await this.model.findAndCountAll(findOptions);

    return {
      results: docs,
      count
    };
  }

  async findById(id) {
    const findOptions = {};
    if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    const document = await this.model.findByPk(id, findOptions);

    if (!document) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    return document;
  }

  // Método para encontrar uno con filtros personalizados
  async findOne(filters = {}) {
    const customFilters = this.buildCustomFilters ?
      this.buildCustomFilters(filters) : filters;

    const findOptions = {
      where: customFilters
    };

    if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    return await this.model.findOne(findOptions);
  }

  // Método para contar documentos
  async count(filters = {}) {
    const customFilters = this.buildCustomFilters ?
      this.buildCustomFilters(filters) : filters;

    return await this.model.count({ where: customFilters });
  }

  // Método para verificar si existe un documento
  async exists(filters) {
    const total = await this.model.count({ where: filters, limit: 1 });
    return total > 0;
  }
}

module.exports = BaseReadOnlyService;
