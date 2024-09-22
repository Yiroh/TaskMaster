module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('High', 'Medium', 'Low'),
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.ENUM('Todo', 'In Progress', 'Almost Complete', 'Complete'),
      defaultValue: 'Todo',
    },
  });

  return Todo;
};

