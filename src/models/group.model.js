const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'groups',
    timestamps: true
  });


  Group.associate = (models) => {
    Group.belongsToMany(models.Person, {
      through: models.PersonGroup,
      foreignKey: 'groupId',
      otherKey: 'personId',
      as: 'persons'
    });
    Group.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Group.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Group;
};

