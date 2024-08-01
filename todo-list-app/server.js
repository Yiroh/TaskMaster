const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path-browserify');
const Store = require('electron-store');

const store = new Store();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    dueDate: { type: Date, required: false },
    category: { type: Number, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Almost Complete', 'Complete'], default: 'Todo' }
});

const Todo = mongoose.model('Todo', todoSchema);

// Endpoint to get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Endpoint to add a new todo
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error adding todo' });
    }
});

// Endpoint to update a todo
app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// Endpoint to delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
