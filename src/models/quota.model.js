const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Quota = sequelize.define('Quota', {
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
    number: {
      type: DataTypes.STRING,
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
    shoppingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'shoppings',
        key: 'id'
      }
    },
    expenseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'expenses',
        key: 'id'
      }
    },
    monthlyBudgetId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'monthly_budgets',
        key: 'id'
      }
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'quotas',
    timestamps: true
  });

  Quota.associate = (models) => {
    Quota.belongsTo(models.Shopping, {
      foreignKey: 'shoppingId',
      as: 'shopping'
    });
    Quota.belongsTo(models.Expense, {
      foreignKey: 'expenseId',
      as: 'expense'
    });
    Quota.belongsTo(models.MonthlyBudget, {
      foreignKey: 'monthlyBudgetId',
      as: 'monthlyBudget'
    });
    Quota.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Quota.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Quota.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Quota;
};

