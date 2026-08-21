const { accountService } = require('../services');
const BaseController = require('./BaseController');

class AccountController extends BaseController {
  constructor() {
    super(accountService);
  }
}

module.exports = new AccountController();
