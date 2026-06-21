const { incomeTypeService } = require('../services');
const BaseController = require('./BaseController');

class IncomeTypeController extends BaseController {
  constructor() {
    super(incomeTypeService);
  }
}

module.exports = new IncomeTypeController();
