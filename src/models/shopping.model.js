const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Shopping = sequelize.define('Shopping', {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quotasCount: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    ...auditFields(DataTypes)
  }, {
    tableName: 'shoppings',
    timestamps: true
  });

  Shopping.associate = (models) => {
    Shopping.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'type'
    });
    Shopping.belongsTo(models.Subtype, {
      foreignKey: 'subtypeId',
      as: 'subtype'
    });
    Shopping.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Shopping.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Shopping.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
    Shopping.hasMany(models.Quota, {
      foreignKey: 'shoppingId',
      as: 'quotas'
    });
  };

  return Shopping;
};

