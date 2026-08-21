const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'ARS'
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
    tableName: 'accounts',
    timestamps: true
  });

  Account.associate = (models) => {
    Account.hasMany(models.AccountStatus, {
      foreignKey: 'accountId',
      as: 'statuses'
    });
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Account.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Account.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Account;
};
