const { quotaService } = require('../services');
const BaseController = require('./BaseController');
const ResponseHelper = require('../utils/response');

class QuotaController extends BaseController {
  constructor() {
    super(quotaService);
  }

  async payQuota(req, res) {
    const { id } = req.params;
    const data = req.body;
    const result = await quotaService.payQuota(id, data, req.user);
    return ResponseHelper.created(res, result);
  }
}

module.exports = new QuotaController();
