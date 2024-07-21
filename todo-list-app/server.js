const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todoList', { useNewUrlParser: true, useUnifiedTopology: true });

const TodoSchema = new mongoose.Schema({
    text: String,
    status: { type: String, default: 'Todo' },
    dueDate: Date,
    category: Number
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        status: req.body.status,
        dueDate: req.body.dueDate,
        category: req.body.category
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
});

app.patch('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { status, dueDate, category } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { status, dueDate, category }, { new: true });
    res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
