const { paymentMethodService } = require('../services');
const BaseController = require('./BaseController');

class PaymentMethodController extends BaseController {
  constructor() {
    super(paymentMethodService);
  }
}

module.exports = new PaymentMethodController();
