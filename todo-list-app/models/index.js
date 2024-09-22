// models/index.js
const Sequelize = require('sequelize');
const path = require('path');

// Initialize Sequelize to use SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

// Initialize models
const TodoModel = require('./todo');
const CategoryModel = require('./category');

const Todo = TodoModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);

// Define associations
Category.hasMany(Todo, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Todo.belongsTo(Category, { foreignKey: 'categoryId' });

// Export the sequelize instance and models
module.exports = {
  sequelize,
  Todo,
  Category,
};
