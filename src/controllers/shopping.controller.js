const { shoppingService } = require('../services');
const BaseController = require('./BaseController');

class ShoppingController extends BaseController {
  constructor() {
    super(shoppingService);
  }
}

module.exports = new ShoppingController();
