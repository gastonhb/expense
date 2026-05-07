const { typeService } = require('../services');
const BaseController = require('./BaseController');

class TypeController extends BaseController {
  constructor() {
    super(typeService);
  }
}

module.exports = new TypeController();
