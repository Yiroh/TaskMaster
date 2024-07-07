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
    completed: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        completed: false
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
