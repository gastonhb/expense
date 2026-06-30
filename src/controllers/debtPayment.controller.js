const { debtPaymentService } = require('../services');
const BaseController = require('./BaseController');

class DebtPaymentController extends BaseController {
  constructor() {
    super(debtPaymentService);
  }
}

module.exports = new DebtPaymentController();
