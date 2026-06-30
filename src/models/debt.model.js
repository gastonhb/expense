const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Debt = sequelize.define('Debt', {
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
    tableName: 'debts',
    timestamps: true
  });

  Debt.associate = (models) => {
    Debt.belongsTo(models.Debtor, {
      foreignKey: 'debtorId',
      as: 'debtor'
    });
    Debt.belongsTo(models.User, {
      foreignKey: 'ownerUserId',
      as: 'owner'
    });
    Debt.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Debt.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Debt;
};
