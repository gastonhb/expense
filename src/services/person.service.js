const { Person } = require('../models');
const BaseService = require('./BaseService');

class PersonService extends BaseService {
  constructor() {
    super(Person, 'Person');
    this.defaultSort = 'name';
    this.textSearchFields = ['name', 'lastName'];
  }

  /**
   * Find or create a person by name and lastName
   * @param {Object} data - { name, lastName, userId }
   * @param {Object} reqUser - The authenticated user
   * @returns {Promise<Person>}
   */
  async findOrCreate(data, reqUser, options) {
    const { name, lastName, userId } = data;

    // Search for existing person
    const existing = await this.findOne(
      {
        name,
        lastName,
        ...(userId && { userId })
      },
      options
    );

    if (existing) {
      return existing;
    }

    // Create new person if not found
    return await this.create({ name, lastName, userId }, reqUser, options);
  }

  /**
   * Find or create multiple persons
   * @param {Array<Object>} personsData - Array of { name, lastName, userId }
   * @param {Object} reqUser - The authenticated user
   * @returns {Promise<Array<Person>>}
   */
  async findOrCreateMany(personsData, reqUser, options) {
    const persons = [];

    for (const personData of personsData) {
      const person = await this.findOrCreate(personData, reqUser, options);
      persons.push(person);
    }

    return persons;
  }
}

module.exports = new PersonService();
