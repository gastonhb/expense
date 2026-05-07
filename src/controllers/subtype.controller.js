const { subtypeService } = require('../services');
const BaseController = require('./BaseController');

class SubtypeController extends BaseController {
  constructor() {
    super(subtypeService);
  }
}

module.exports = new SubtypeController();
