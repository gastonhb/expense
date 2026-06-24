const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const MonthlyBudget = sequelize.define('MonthlyBudget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
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
    tableName: 'monthly_budgets',
    timestamps: true
  });

  MonthlyBudget.associate = (models) => {
    MonthlyBudget.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    MonthlyBudget.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    MonthlyBudget.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
    MonthlyBudget.hasMany(models.Budget, {
      foreignKey: 'monthlyBudgetId',
      as: 'budgets'
    });
  };

  return MonthlyBudget;
};
