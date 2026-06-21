const { groupService } = require('../services');
const BaseController = require('./BaseController');

class GroupController extends BaseController {
  constructor() {
    super(groupService);
  }
}

module.exports = new GroupController();
