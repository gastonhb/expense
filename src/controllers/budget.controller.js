const { budgetService } = require('../services');
const BaseController = require('./BaseController');
const ResponseHelper = require('../utils/response');
class BudgetController extends BaseController {
  constructor() {
    super(budgetService);
  }

  async payBudget(req, res) {
    const { id } = req.params;
    const data = req.body;
    const result = await budgetService.payBudget(id, data, req.user);
    return ResponseHelper.created(res, result);
  }
}

module.exports = new BudgetController();
