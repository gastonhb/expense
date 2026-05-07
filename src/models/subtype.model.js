const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subtype = sequelize.define('Subtype', {
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
    },
    typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'types',
        key: 'id'
      }
    }
  }, {
    tableName: 'subtypes',
    timestamps: true
  });

  Subtype.associate = (models) => {
    Subtype.belongsTo(models.Type, {
      foreignKey: 'typeId',
      as: 'type'
    });
  };

  return Subtype;
};
