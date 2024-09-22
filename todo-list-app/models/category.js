module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#000000',
      },
    });
  
    return Category;
  };
  