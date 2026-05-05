const BaseReadOnlyController = require('./BaseReadOnlyController');
const ResponseHelper = require('../utils/response');
const withAsyncHandling = require('../mixins/withAsyncHandling');

class BaseControllerCore extends BaseReadOnlyController {
  async create(req, res) {
    const { body } = req;
    const result = await this.service.create(body);
    return ResponseHelper.created(res, result);
  }

  async update(req, res) {
    const { params, body } = req;
    const result = await this.service.update(params.id, body);
    return ResponseHelper.updated(res, result);
  }

  async delete(req, res) {
    const { params } = req;
    await this.service.delete(params.id);
    return ResponseHelper.deleted(res);
  }
}

// Aplicar el mixin para auto-wrapping con catchAsync
const BaseController = withAsyncHandling(BaseControllerCore);

module.exports = BaseController;
