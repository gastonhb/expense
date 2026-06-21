const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Income = sequelize.define('Income', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    incomeTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'income_types',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'incomes',
    timestamps: true
  });

  Income.associate = (models) => {
    Income.belongsTo(models.IncomeType, {
      foreignKey: 'incomeTypeId',
      as: 'incomeType'
    });
    Income.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Income.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Income.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Income;
};

