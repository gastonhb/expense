const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const DebtPayment = sequelize.define('DebtPayment', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    debtorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'debtors',
        key: 'id'
      }
    },
    ownerUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'debt_payments',
    timestamps: true
  });

  DebtPayment.associate = (models) => {
    DebtPayment.belongsTo(models.Debtor, {
      foreignKey: 'debtorId',
      as: 'debtor'
    });
    DebtPayment.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });
    DebtPayment.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    DebtPayment.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return DebtPayment;
};
