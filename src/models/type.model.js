const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Type = sequelize.define('Type', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
