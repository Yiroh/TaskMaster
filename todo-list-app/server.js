const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        dueDate: req.body.dueDate,
        category: req.body.category,
        priority: req.body.priority,
        status: req.body.status,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (req.body.text != null) todo.text = req.body.text;
        if (req.body.dueDate != null) todo.dueDate = req.body.dueDate;
        if (req.body.category != null) todo.category = req.body.category;
        if (req.body.priority != null) todo.priority = req.body.priority;
        if (req.body.status != null) todo.status = req.body.status;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
