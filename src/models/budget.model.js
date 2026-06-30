const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Budget = sequelize.define('Budget', {
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
    typeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'types',
        key: 'id'
      }
    },
    subtypeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'subtypes',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    monthlyBudgetId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'monthly_budgets',
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
    ...auditFields(DataTypes)
  }, {
    tableName: 'budgets',
    timestamps: true
  });

  Budget.associate = (models) => {
    Budget.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'type'
    });
    Budget.belongsTo(models.Subtype, {
      foreignKey: 'subtypeId',
      as: 'subtype'
    });
    Budget.belongsTo(models.Expense, {
      foreignKey: 'expenseId',
      as: 'expense'
    });
    Budget.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Budget.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Budget.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Budget;
};

