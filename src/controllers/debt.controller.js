const { debtService } = require('../services');
const BaseController = require('./BaseController');

class DebtController extends BaseController {
  constructor() {
    super(debtService);
  }
}

module.exports = new DebtController();
