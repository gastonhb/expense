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
  getFindIncludes(_context = {}) {
    return this.findIncludes;
  }

  /**
   * Hook para definir includes por defecto en búsquedas unitarias.
   * Puede sobrescribirse en cada service.
   * @param {Object} context - Contexto de la consulta
   * @returns {Array|Object|undefined} Includes de Sequelize
   */
  getFindOneIncludes(context = {}) {
    return this.findOneIncludes ?? this.getFindIncludes(context);
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

  resolveFindOptions(options = {}) {
    return {
      paginate: options.paginate ?? true,
      page: options.page ?? options._page,
      limit: options.limit ?? options._limit,
      order: options.order ?? options._order,
      include: options.include,
      attributes: options.attributes
    };
  }

  async find(filters = {}, options = {}) {
    const safeFilters = this.extractFindFilters(filters);
    const resolvedOptions = this.resolveFindOptions(options);
    const paginate = resolvedOptions.paginate;

    // Configurar paginación
    const hasCustomLimit = resolvedOptions.limit !== undefined;
    const page = parseInt(resolvedOptions.page) || 1;
    const limit = hasCustomLimit ? Math.min(parseInt(resolvedOptions.limit), 100) : config.pagination.defaultPageSize;

    // Validar página mínima
    if (page < 1) {
      throw new ServiceError('La página debe ser mayor a 0');
    }

    if (hasCustomLimit && (!Number.isInteger(limit) || limit < 1)) {
      throw new ServiceError('El limite debe ser mayor a 0');
    }

    // Calcular skip
    const skip = (page - 1) * limit;

    const order = [];
    const validOrderFields = Object.keys(this.model.rawAttributes || {});

    if (resolvedOptions.order) {
      const sortFields = resolvedOptions.order.split(',').map((field) => field.trim()).filter(Boolean);

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
      searchFilters = this.buildCustomFilters(safeFilters);
    } else {
      searchFilters = this.applyAutoFilters(safeFilters);
    }

    const findOptions = {
      where: searchFilters,
      order
    };

    if (paginate) {
      findOptions.offset = skip;
      findOptions.limit = limit;
    } else if (hasCustomLimit) {
      findOptions.limit = limit;
      if (page > 1) {
        findOptions.offset = skip;
      }
    }

    const defaultIncludes = this.getFindIncludes({
      filters: safeFilters,
      options: resolvedOptions,
      where: searchFilters
    });

    const includes = resolvedOptions.include !== undefined ? resolvedOptions.include : defaultIncludes;

    if (includes !== undefined) {
      findOptions.include = includes;
    }

    if (resolvedOptions.attributes !== undefined) {
      findOptions.attributes = resolvedOptions.attributes;
    } else if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    if (!paginate) {
      return await this.model.findAll(findOptions);
    }

    const { rows: docs, count } = await this.model.findAndCountAll(findOptions);

    return {
      results: docs,
      count
    };
  }

  async findById(id) {
    const findOptions = {};

    const defaultIncludes = this.getFindOneIncludes({ id });

    if (defaultIncludes !== undefined) {
      findOptions.include = defaultIncludes;
    }

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

    const defaultIncludes = this.getFindOneIncludes({
      filters,
      where: customFilters
    });

    if (defaultIncludes !== undefined) {
      findOptions.include = defaultIncludes;
    }

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
