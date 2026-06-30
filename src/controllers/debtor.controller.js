const { debtorService } = require('../services');
const BaseController = require('./BaseController');
const ResponseHelper = require('../utils/response');

class DebtorController extends BaseController {
  constructor() {
    super(debtorService);
  }

  async getBalance (req, res) {
    const { id } = req.params;
    const result = await debtorService.getBalance(id, req.user);
    return ResponseHelper.created(res, result);
  }
}

module.exports = new DebtorController();
