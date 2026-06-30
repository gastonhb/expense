const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Debtor = sequelize.define('Debtor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
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
    tableName: 'debtors',
    timestamps: true
  });

  Debtor.associate = (models) => {
    Debtor.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Debtor.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });
    Debtor.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Debtor.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
    Debtor.hasMany(models.Debt, {
      foreignKey: 'debtorId',
      as: 'debts'
    });
    Debtor.hasMany(models.DebtPayment, {
      foreignKey: 'debtorId',
      as: 'payments'
    });
    Debtor.hasMany(models.InstallmentDebt, {
      foreignKey: 'debtorId',
      as: 'installmentDebts'
    });
  };

  return Debtor;
};
