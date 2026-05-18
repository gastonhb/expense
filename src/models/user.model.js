const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    authenticationId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ...auditFields(DataTypes)
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Expense, {
      foreignKey: 'userId',
      as: 'expenses'
    });
    User.hasMany(models.PaymentMethod, {
      foreignKey: 'userId',
      as: 'paymentMethods'
    });
    User.hasMany(models.Type, {
      foreignKey: 'userId',
      as: 'types'
    });
    User.hasMany(models.Subtype, {
      foreignKey: 'userId',
      as: 'subtypes'
    });
    User.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    User.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return User;
};
