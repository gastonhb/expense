const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Type = sequelize.define('Type', {
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
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'types',
    timestamps: true
  });

  Type.associate = (models) => {
    Type.hasMany(models.Subtype, {
      foreignKey: 'typeId',
      as: 'subtypes'
    });
    Type.hasMany(models.Expense, {
      foreignKey: 'typeId',
      as: 'expenses'
    });
    Type.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Type.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Type.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Type;
};
