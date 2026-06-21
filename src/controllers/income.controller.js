const { incomeService } = require('../services');
const BaseController = require('./BaseController');

class IncomeController extends BaseController {
  constructor() {
    super(incomeService);
  }
}

module.exports = new IncomeController();
