const { accountStatusService } = require('../services');
const BaseController = require('./BaseController');

class AccountStatusController extends BaseController {
  constructor() {
    super(accountStatusService);
  }
}

module.exports = new AccountStatusController();
