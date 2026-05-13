const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Type = sequelize.define('Type', {
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
    }
  }, {
    tableName: 'types',
    timestamps: true
  });

  Type.associate = (models) => {
    Type.hasMany(models.Subtype, {
      foreignKey: 'typeId',
      as: 'subtypes'
    });
  };

  return Type;
};
