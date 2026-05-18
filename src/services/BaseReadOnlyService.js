const config = require('../config/environment');
const { Op } = require('sequelize');
const { NotFoundServiceError, ServiceError } = require('./errors');

class BaseReadOnlyService {
  constructor(model, entityName) {
    this.model = model;
    this.entityName = entityName;
  }

  shouldEnforceUserScope() {
    return Boolean(this.model.rawAttributes?.userId) && this.enforceUserScope !== false;
  }

  resolveRequestUserId(reqUser) {
    return reqUser?.id ?? reqUser?.userId ?? null;
  }

  getScopedWhere(reqUser) {
    if (!this.shouldEnforceUserScope()) {
      return {};
    }

    const userId = this.resolveRequestUserId(reqUser);

    if (!userId) {
      throw new ServiceError('Debes estar autenticado para acceder a este recurso');
    }

    return { userId };
  }

  applyUserScope(where = {}, reqUser) {
    return {
      ...where,
      ...this.getScopedWhere(reqUser)
    };
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

  async find(filters = {}, options = {}, reqUser = null) {
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

    const validOrderFields = Object.keys(this.model.rawAttributes || {});
    const defaultSort = this.defaultSort || 'createdAt';
    const orderOption = resolvedOptions.order || defaultSort;
    const order = this.buildOrder(orderOption, validOrderFields);

    let searchFilters;
    if (this.buildCustomFilters && typeof this.buildCustomFilters === 'function') {
      searchFilters = this.buildCustomFilters(safeFilters);
    } else {
      searchFilters = this.applyAutoFilters(safeFilters);
    }

    searchFilters = this.applyUserScope(searchFilters, reqUser);

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

  async findById(id, reqUser = null) {
    const findOptions = {};
    const defaultIncludes = this.getFindOneIncludes({ id });

    if (defaultIncludes !== undefined) {
      findOptions.include = defaultIncludes;
    }

    if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    findOptions.where = this.applyUserScope({ id }, reqUser);

    const element = await this.model.findOne(findOptions);
    if (!element) {
      throw new NotFoundServiceError(this.entityName, id);
    }

    return element;
  }

  // Método para encontrar uno con filtros personalizados
  async findOne(filters = {}, reqUser = null) {
    const customFilters = this.buildCustomFilters ?
      this.buildCustomFilters(filters) : filters;

    const findOptions = {
      where: this.applyUserScope(customFilters, reqUser)
    };

    const defaultIncludes = this.getFindOneIncludes({
      filters,
      where: this.applyUserScope(customFilters, reqUser)
    });

    if (defaultIncludes !== undefined) {
      findOptions.include = defaultIncludes;
    }

    if (this.defaultSelect) {
      findOptions.attributes = this.defaultSelect;
    }

    return await this.model.findOne(findOptions);
  }

  // Método para contar elementos con filtros personalizados
  async count(filters = {}, reqUser = null) {
    const customFilters = this.buildCustomFilters ?
      this.buildCustomFilters(filters) : filters;

    return await this.model.count({ where: this.applyUserScope(customFilters, reqUser) });
  }

  // Método para verificar si existe un elemento con ciertos filtros
  async exists(filters, reqUser = null) {
    const total = await this.model.count({ where: this.applyUserScope(filters, reqUser), limit: 1 });
    return total > 0;
  }
}

module.exports = BaseReadOnlyService;
