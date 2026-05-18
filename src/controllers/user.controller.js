const { userService } = require('../services');
const BaseController = require('./BaseController');

class UserController extends BaseController {
  constructor() {
    super(userService);
  }
}

module.exports = new UserController();
