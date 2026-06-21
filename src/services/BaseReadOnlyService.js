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

  /**
   * Aplicar filtros automáticos basados en textSearchFields y dateRangeFields
   * @param {Object} filters - Filtros a procesar
   * @returns {Object} Filtros procesados
   */
  applyAutoFilters(filters) {
    const searchFilters = {};
    const processedKeys = new Set();

    // Aplicar textSearchFields automáticamente con iLike
    if (this.textSearchFields && Array.isArray(this.textSearchFields)) {
      for (const field of this.textSearchFields) {
        if (filters[field]) {
          Object.assign(searchFilters, this.textSearch([field], filters[field]));
          processedKeys.add(field);
        }
      }
    }

    // Aplicar dateRangeFields automáticamente
    if (this.dateRangeFields && Array.isArray(this.dateRangeFields)) {
      for (const field of this.dateRangeFields) {
        const fromKey = `${field}From`;
        const toKey = `${field}To`;
        const exactKey = field;

        if (filters[exactKey]) {
          searchFilters[field] = filters[exactKey];
          processedKeys.add(exactKey);
        } else if (filters[fromKey] || filters[toKey]) {
          Object.assign(searchFilters, this.dateFilter(field, filters[fromKey], filters[toKey]));
          processedKeys.add(fromKey);
          processedKeys.add(toKey);
        }
      }
    }

    // Pasar filtros restantes como están (igualdad exacta)
    for (const [key, value] of Object.entries(filters)) {
      if (!processedKeys.has(key) && value !== undefined) {
        searchFilters[key] = value;
      }
    }

    return searchFilters;
  }

  /**
   * Hook para definir includes por defecto en listados.
   * Puede sobrescribirse en cada service.
   * @param {Object} _context - Contexto de la consulta
   * @returns {Array|Object|undefined} Includes de Sequelize
   */
  get findIncludes() {
    return undefined;
  }

  /**
   * Hook para definir includes por defecto en búsquedas unitarias.
   * Puede sobrescribirse en cada service.
   * @param {Object} context - Contexto de la consulta
   * @returns {Array|Object|undefined} Includes de Sequelize
   */
  get findOneIncludes() {
    return this.findIncludes;
  }

  extractFindFilters(filters = {}) {
    const {
      _page,
      _limit,
      _order,
      page: _pageOption,
      limit: _limitOption,
      order: _orderOption,
      paginate: _paginate,
      ...safeFilters
    } = filters;
    return safeFilters;
  }

  buildOrder(orderOption, validOrderFields) {
    const order = [];
    const sortFields = orderOption.split(',').map((field) => field.trim()).filter(Boolean);

    sortFields.forEach((field) => {
      const isDescending = field.startsWith('-');
      const fieldName = isDescending ? field.substring(1) : field;

      if (!validOrderFields.includes(fieldName)) {
        throw new ServiceError(`Campo de ordenamiento no valido: ${fieldName}`);
      }

      order.push([fieldName, isDescending ? 'DESC' : 'ASC']);
    });

    return order;
  }

  async find(filters = {}, options = {}) {
    const safeFilters = this.extractFindFilters(filters);

    // Configurar paginación
    const page = options._page ? Number(options._page) : 1;
    const limit = options._limit ? Number(options._limit) : config.pagination.defaultPageSize;

    // Validar página mínima
    if (page < 1) {
      throw new ServiceError('Page must be greater than 0');
    }

    if ((!Number.isInteger(limit) || limit < 1)) {
      throw new ServiceError('Limit must be a positive integer');
    }

    const validOrderFields = Object.keys(this.model.rawAttributes || {});
    const defaultSort = this.defaultSort || 'createdAt';
    const orderOption = options._order || defaultSort;
    const order = this.buildOrder(orderOption, validOrderFields);

    let searchFilters;
    if (this.buildCustomFilters && typeof this.buildCustomFilters === 'function') {
      searchFilters = this.buildCustomFilters(safeFilters);
    } else {
      searchFilters = this.applyAutoFilters(safeFilters);
    }

    const findOptions = {
      where: searchFilters,
      order
    };

    const paginate = options.paginate ?? true;
    if (paginate) {
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }

    if (!options.includes && this.findIncludes) {
      findOptions.include = this.findIncludes;
    } else if (options.includes) {
      findOptions.include = options.includes;
    }

    if (options.attributes) {
      findOptions.attributes = options.attributes;
    }

    const { rows, count } = await this.model.findAndCountAll(findOptions);

    return {
      results: rows,
      count
    };
  }

  async findById(id, options = {}) {
    if (!id) {
      throw new ServiceError('Invalid query');
    }

    const element = await this.findOne({ id }, options);
    if (!element) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    return element;
  }

  // Método para encontrar uno con filtros personalizados
  async findOne(filters = {}, options = {}) {
    if(!options.include && this.findOneIncludes) {
      options.include = this.findIncludes;
    }

    const response = await this.find(filters, { ...options, limit: 1, page: 1 });
    return response.results[0] ?? null;
  }
}

module.exports = BaseReadOnlyService;
