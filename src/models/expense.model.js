const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Expense = sequelize.define('Expense', {
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
    paymentMethodId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'payment_methods',
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
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'expenses',
    timestamps: true
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.PaymentMethod, {
      foreignKey: 'paymentMethodId',
      as: 'paymentMethod'
    });
    Expense.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'type'
    });
    Expense.belongsTo(models.Subtype, {
      foreignKey: 'subtypeId',
      as: 'subtype'
    });
    Expense.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Expense.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group'
    });
    Expense.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Expense.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Expense;
};

