const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const PersonGroup = sequelize.define('PersonGroup', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    personId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'persons',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    since: {
      type: DataTypes.DATEONLY
    },
    until: {
      type: DataTypes.DATEONLY
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'person_groups',
    timestamps: true
  });

  PersonGroup.associate = (models) => {
    PersonGroup.belongsTo(models.Person, {
      foreignKey: 'personId',
      as: 'person'
    });
    PersonGroup.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group'
    });
  };

  return PersonGroup;
};
