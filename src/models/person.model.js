const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Person = sequelize.define('Person', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'persons',
    timestamps: true
  });

  Person.associate = (models) => {
    Person.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Person.belongsToMany(models.Group, {
      through: models.PersonGroup,
      foreignKey: 'personId',
      otherKey: 'groupId',
      as: 'groups'
    });
  };

  return Person;
};

