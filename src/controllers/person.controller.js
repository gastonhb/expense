const { personService } = require('../services');
const BaseController = require('./BaseController');

class PersonController extends BaseController {
  constructor() {
    super(personService);
  }
}

module.exports = new PersonController();
