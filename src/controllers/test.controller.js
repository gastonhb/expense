const { testService } = require('../services');
const BaseController = require('./BaseController');

class TestController extends BaseController {
  constructor() {
    super(testService);
  }
}

module.exports = new TestController();
