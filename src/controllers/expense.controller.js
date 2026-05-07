const { expenseService } = require('../services');
const BaseController = require('./BaseController');

class ExpenseController extends BaseController {
  constructor() {
    super(expenseService);
  }
}

module.exports = new ExpenseController();
