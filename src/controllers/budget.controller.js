const { budgetService } = require('../services');
const BaseController = require('./BaseController');

class BudgetController extends BaseController {
  constructor() {
    super(budgetService);
  }
}

module.exports = new BudgetController();
