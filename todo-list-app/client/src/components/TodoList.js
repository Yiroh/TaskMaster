import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Customer Success', color: '#a083d9' },
        { id: 2, name: 'Website Development', color: '#5fa971' }
    ]);
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState(categories[0].id);
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#000000');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

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
        const newTodo = { text, dueDate, category, status: 'Todo' };
        axios.post('http://localhost:5000/todos', newTodo)
            .then(response => {
                console.log("Task added: ", response.data);
                setTodos([...todos, response.data]); // Update state with new todo
                setText(''); // Clear the input field
                setDueDate(''); // Clear the due date field
            })
            .catch(error => {
                console.error("There was an error adding the todo!", error);
            });
    };

    const addCategory = () => {
        if (newCategory.trim() === '') {
            console.log("Empty category name, not adding");
            return; // Prevent adding empty categories
        }
        const newCat = { id: Date.now(), name: newCategory, color: newCategoryColor };
        setCategories([...categories, newCat]);
        setNewCategory(''); // Clear the input field
        setNewCategoryColor('#000000'); // Reset the color picker
    };

    const removeTodo = (id) => {
        axios.delete(`http://localhost:5000/todos/${id}`)
            .then(response => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the todo!", error);
            });
    };

    const removeCategory = (id) => {
        setCategories(categories.filter(cat => cat.id !== id));
        setTodos(todos.filter(todo => todo.category !== id));
    };

    const updateTodoStatus = (id, status, dueDate, category) => {
        axios.patch(`http://localhost:5000/todos/${id}`, { status, dueDate, category })
            .then(response => {
                setTodos(todos.map(todo => todo._id === id ? response.data : todo));
            })
            .catch(error => {
                console.error("There was an error updating the todo!", error);
            });
    };

    const startEditingCategory = (id, name) => {
        setEditingCategoryId(id);
        setEditingCategoryName(name);
    };

    const saveCategoryName = (id) => {
        setCategories(categories.map(cat => cat.id === id ? { ...cat, name: editingCategoryName } : cat));
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    return (
        <div className="todo-list">
            <h1>TaskMaster</h1>
            <div className="input-section">
                <h3>Add New Task</h3>
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
                <select value={category} onChange={(e) => setCategory(parseInt(e.target.value))}>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <button onClick={addTodo}>Add Task</button>
            </div>
            <div className="category-input-section">
                <h3>Add New Category</h3>
                <input
                    type="text" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Category name"
                />
                <input 
                    type="color" 
                    value={newCategoryColor} 
                    onChange={(e) => setNewCategoryColor(e.target.value)} 
                />
                <button onClick={addCategory}>Add Category</button>
            </div>
            {categories.map(cat => (
                <div key={cat.id} className="category-section">
                    <h2 style={{ backgroundColor: cat.color }}>
                        {editingCategoryId === cat.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingCategoryName} 
                                    onChange={(e) => setEditingCategoryName(e.target.value)} 
                                    onBlur={() => saveCategoryName(cat.id)}
                                    className="edit-category-input"
                                />
                                <button className="save-category" onClick={() => saveCategoryName(cat.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                {cat.name}
                                <span className="category-icons">
                                    <FontAwesomeIcon icon={faPencilAlt} className="edit-category" onClick={() => startEditingCategory(cat.id, cat.name)} />
                                    <FontAwesomeIcon icon={faTimes} className="remove-category" onClick={() => removeCategory(cat.id)} />
                                </span>
                            </>
                        )}
                    </h2>
                    <div className="tasks">
                        {todos.filter(todo => todo.category === cat.id).map(todo => (
                            <TodoItem 
                                key={todo._id} 
                                todo={todo} 
                                updateStatus={updateTodoStatus} 
                                removeTodo={removeTodo}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodoList;
