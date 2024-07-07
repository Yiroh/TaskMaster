import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/todos')
            .then(response => {
                setTodos(response.data);
            });
    }, []);

    const addTodo = () => {
        axios.post('http://localhost:5000/todos', { text })
            .then(response => {
                setTodos([...todos, response.data]);
                setText('');
            });
    };

    return (
        <div>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
            />
            <button onClick={addTodo}>Add Todo</button>
            {todos.map(todo => (
                <TodoItem key={todo._id} todo={todo} />
            ))}
        </div>
    );
};

export default TodoList;
