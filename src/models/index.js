const Database = require('../config/database');

const Test = require('./test.model')(Database.getSequelize());

module.exports = {
  Test
};
