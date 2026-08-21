const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const AccountStatus = sequelize.define('AccountStatus', {
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
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id'
      }
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
    tableName: 'account_statuses',
    timestamps: true,
    indexes: [{
      unique: true,
      fields: ['accountId', 'date']
    }]
  });

  AccountStatus.associate = (models) => {
    AccountStatus.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account'
    });
    AccountStatus.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    AccountStatus.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    AccountStatus.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return AccountStatus;
};
