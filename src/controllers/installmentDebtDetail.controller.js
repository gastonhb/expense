const { installmentDebtDetailService } = require('../services');
const BaseController = require('./BaseController');
const ResponseHelper = require('../utils/response');

class InstallmentDebtDetailController extends BaseController {
  constructor() {
    super(installmentDebtDetailService);
  }

  async payInstallment(req, res) {
    const { id } = req.params;
    const result = await installmentDebtDetailService.payInstallment(id, req.body, req.user);
    return ResponseHelper.created(res, result);
  }
}

module.exports = new InstallmentDebtDetailController();
