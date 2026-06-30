const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const InstallmentDebt = sequelize.define('InstallmentDebt', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quotasCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'installment_debts',
    timestamps: true
  });

  InstallmentDebt.associate = (models) => {
    InstallmentDebt.belongsTo(models.Debtor, {
      foreignKey: 'debtorId',
      as: 'debtor'
    });
    InstallmentDebt.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });
    InstallmentDebt.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    InstallmentDebt.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
    InstallmentDebt.hasMany(models.InstallmentDebtDetail, {
      foreignKey: 'installmentDebtId',
      as: 'installments'
    });
  };

  return InstallmentDebt;
};
