const { DataTypes } = require('sequelize');

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
