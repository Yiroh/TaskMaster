import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/todos')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the todos!", error);
            });
    }, []);

    const addTodo = () => {
        if (text.trim() === '') {
            console.log("Empty task, not adding");
            return; // Prevent adding empty todos
        }
        axios.post('http://localhost:5000/todos', { text, dueDate })
            .then(response => {
                setTodos([...todos, response.data]); // Update state with new todo
                setText(''); // Clear the input field
                setDueDate(''); // Clear the due date field
            })
            .catch(error => {
                console.error("There was an error adding the todo!", error);
            });
    };

    const updateTodoStatus = (id, status, dueDate) => {
        axios.patch(`http://localhost:5000/todos/${id}`, { status, dueDate })
            .then(response => {
                setTodos(todos.map(todo => todo._id === id ? response.data : todo));
            })
            .catch(error => {
                console.error("There was an error updating the todo!", error);
            });
    };

    return (
        <div>
            <h1>TaskMaster</h1>
            <input
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Add a new task"
            />
            <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
            />
            <button onClick={addTodo}>Add Task</button>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo._id}>
                            <TodoItem 
                                todo={todo} 
                                updateStatus={updateTodoStatus} 
                            />
                        </tr>
                    ))}
                </tbody>
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;
