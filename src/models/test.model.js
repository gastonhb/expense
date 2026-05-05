const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Test = sequelize.define('Test', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'tests',
    timestamps: true
  });

  return Test;
};
