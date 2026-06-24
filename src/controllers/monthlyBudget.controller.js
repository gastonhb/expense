const { monthlyBudgetService } = require('../services');
const ResponseHelper = require('../utils/response');
const BaseController = require('./BaseController');

class MonthlyBudgetController extends BaseController {
  constructor() {
    super(monthlyBudgetService);
  }

  async copyLastMonth(req, res) {
    const result = await this.service.copyLastMonth(req.user);
    return ResponseHelper.created(res, result);
  }
}

module.exports = new MonthlyBudgetController();
