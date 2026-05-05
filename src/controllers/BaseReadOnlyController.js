const ResponseHelper = require('../utils/response');
const withAsyncHandling = require('../mixins/withAsyncHandling');

class BaseReadOnlyControllerCore {
  constructor(service) {
    this.service = service;
  }

  async find(req, res) {
    const { query } = req;
    const result = await this.service.find(query);
    const links = this.generatePaginationLinks(req, result);
    return ResponseHelper.paginated(res, result, links);
  }

  async findById(req, res) {
    const { params } = req;
    const result = await this.service.findById(params.id);
    return ResponseHelper.success(res, result);
  }

  /**
   * Helper para generar links de paginación
   * @param {Object} req - Request object
   * @param {Object} result - Resultado de la consulta con count
   * @returns {Object} Links de paginación
   */
  generatePaginationLinks = (req, result) => {
    const config = require('../config/environment');

    // Extraer parámetros de paginación del request con valores por defecto
    const page = parseInt(req.query._page) || 1;
    const limit = Math.min(parseInt(req.query._limit) || config.pagination.defaultPageSize, 100);

    // Calcular metadatos de paginación usando el count del result
    const totalDocs = result.count;
    const totalPages = Math.ceil(totalDocs / limit);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    // Construir query parameters base (sin _page)
    const queryParams = { ...req.query };
    delete queryParams._page;

    const buildUrl = (pageNumber) => {
      const params = new URLSearchParams({
        ...queryParams,
        _page: pageNumber.toString(),
        _limit: limit.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const links = {
      first: buildUrl(1),
      prev: page > 1 ? buildUrl(page - 1) : null,
      self: buildUrl(page),
      next: page < totalPages ? buildUrl(page + 1) : null,
      last: buildUrl(totalPages)
    };

    return links;
  };
}

// Aplicar el mixin para auto-wrapping con catchAsync
const BaseReadOnlyController = withAsyncHandling(BaseReadOnlyControllerCore);

module.exports = BaseReadOnlyController;
