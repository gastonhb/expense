const { DataTypes } = require('sequelize');

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
    }
  }, {
    tableName: 'expenses',
    timestamps: true
  });

  return Expense;
};

