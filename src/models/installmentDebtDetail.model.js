const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const InstallmentDebtDetail = sequelize.define('InstallmentDebtDetail', {
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
    installmentDebtId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'installment_debts',
        key: 'id'
      }
    },
    debtPaymentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'debt_payments',
        key: 'id'
      }
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
    tableName: 'installment_debt_details',
    timestamps: true
  });

  InstallmentDebtDetail.associate = (models) => {
    InstallmentDebtDetail.belongsTo(models.InstallmentDebt, {
      foreignKey: 'installmentDebtId',
      as: 'installmentDebt'
    });
    InstallmentDebtDetail.belongsTo(models.DebtPayment, {
      foreignKey: 'debtPaymentId',
      as: 'payment'
    });
    InstallmentDebtDetail.belongsTo(models.Debtor, {
      foreignKey: 'debtorId',
      as: 'debtor'
    });
    InstallmentDebtDetail.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });
    InstallmentDebtDetail.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    InstallmentDebtDetail.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return InstallmentDebtDetail;
};
