const { installmentDebtService } = require('../services');
const BaseController = require('./BaseController');

class InstallmentDebtController extends BaseController {
  constructor() {
    super(installmentDebtService);
  }
}

module.exports = new InstallmentDebtController();
