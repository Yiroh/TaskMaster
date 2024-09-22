const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Todo, Category } = require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, 'client/build')));

// Sync the database
(async () => {
  try {
    await sequelize.sync({ alter: true }); // alter to update tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to sync the database:', error);
  }
})();

// Endpoint to get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Endpoint to add a new todo
app.post('/todos', async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Error adding todo' });
  }
});

// Endpoint to update a todo
app.patch('/todos/:id', async (req, res) => {
  try {
    const [updatedRows] = await Todo.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await Todo.findByPk(req.params.id);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// Endpoint to delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedRows = await Todo.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Add a new category
app.post('/categories', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category' });
  }
});

// Update a category
app.patch('/categories/:id', async (req, res) => {
  try {
    const [updatedRows] = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await Category.findByPk(req.params.id);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
});

// Delete a category
app.delete('/categories/:id', async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});


// Catch-all handler for any request that doesn't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = server;
