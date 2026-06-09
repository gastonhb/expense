const { DataTypes } = require('sequelize');
const auditFields = require('./auditFields');

module.exports = (sequelize) => {
  const Subtype = sequelize.define('Subtype', {
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
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'types',
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
    tableName: 'subtypes',
    timestamps: true
  });

  Subtype.associate = (models) => {
    Subtype.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'type'
    });
    Subtype.hasMany(models.Expense, {
      foreignKey: 'subtypeId',
      as: 'expenses'
    });
    Subtype.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Subtype.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Subtype.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return Subtype;
};
