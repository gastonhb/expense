const { Group, Person } = require('../models');
const BaseService = require('./BaseService');
const { ServiceError } = require('./errors');
const personService = require('./person.service');
const sequelize = require('../config/database').getSequelize();

class GroupService extends BaseService {
  constructor() {
    super(Group, 'Group');
    this.defaultSort = '-createdAt';
  }

  get findOneIncludes () {
    return [{
      model: Person,
      as: 'persons'
    }];
  }

  get findIncludes () {
    return [{
      model: Person,
      as: 'persons'
    }];
  }

  /**
   * Create a group and automatically create/associate persons if provided
   * @param {Object} data - { name, description, persons: [{name, lastName, userId}] }
   * @param {Object} reqUser - The authenticated user
   * @returns {Promise<Group>} Group with associated persons
   */
  async create(data, reqUser, options = {}) {
    if(!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        await this.create(data, reqUser, { ...options, transaction });
      });
    }
    const { persons: personsData, ...groupData } = data;

    // Create the group without persons data
    const group = await super.create(groupData, reqUser, options);

    // If persons data is provided, find or create them and associate
    if (personsData && Array.isArray(personsData) && personsData.length > 0) {
      const persons = await personService.findOrCreateMany(personsData, reqUser, options);

      // Associate all persons with the group
      if (persons.length > 0) {
        return await group.addPersons(persons, options);
      } else {
        throw new ServiceError('Not persons were provided for the group.');
      }
    }
  }

  /**
   * Update a group and optionally update associated persons
   * @param {string} id - Group ID
   * @param {Object} data - { name, description, persons: [{name, lastName, userId}] }
   * @param {Object} reqUser - The authenticated user
   * @returns {Promise<Group>} Updated group with associated persons
   */
  async update(id, data, reqUser, options = {}) {
    if(!options.transaction) {
      return await sequelize.transaction(async (transaction) => {
        await this.update(id, data, reqUser, { ...options, transaction });
      });
    }
    const { persons: personsData, ...groupData } = data;

    const group = await super.findById(id, options);

    // If persons data is provided, update associations
    if (personsData && Array.isArray(personsData)) {
      const persons = await personService.findOrCreateMany(personsData, reqUser, options);

      // Replace all person associations
      await group.setPersons(persons, options);
    }

    // Update the group
    return await super.update(id, groupData, reqUser, options);
  }
}

module.exports = new GroupService();
