const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const IncomeType = sequelize.define('IncomeType', {
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
    tableName: 'income_types',
    timestamps: true
  });

  IncomeType.associate = (models) => {
    IncomeType.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    IncomeType.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return IncomeType;
};
