import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState(null);
    const [priority, setPriority] = useState('Medium');
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#000000');
    const [activeTab, setActiveTab] = useState('task');
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
        if (text.trim() === '' || category === null) {
            console.log("Empty task or no category selected, not adding");
            return; // Prevent adding empty todos or if no category is selected
        }
        const newTodo = { text, dueDate, category, priority, status: 'Todo' };
        axios.post('http://localhost:5000/todos', newTodo)
            .then(response => {
                console.log("Task added: ", response.data);
                setTodos(sortTodosByPriorityAndDate([...todos, response.data])); // Update state with new todo
                setText(''); // Clear the input field
                setDueDate(''); // Clear the due date field
                setPriority('Medium'); // Reset the priority field
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
        setCategory(newCat.id); // Set the newly added category as selected category
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
        if (window.confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter(cat => cat.id !== id));
            setTodos(todos.filter(todo => todo.category !== id));
            if (category === id) setCategory(null); // Reset selected category if it is removed
        }
    };

    const updateTodoStatus = (id, status, dueDate, category, priority) => {
        axios.patch(`http://localhost:5000/todos/${id}`, { status, dueDate, category, priority })
            .then(response => {
                const updatedTodos = todos.map(todo => todo._id === id ? response.data : todo);
                setTodos(sortTodosByPriorityAndDate(updatedTodos));
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

    const sortTodosByPriorityAndDate = (todos) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return todos.sort((a, b) => {
            if (priorityOrder[a.priority] === priorityOrder[b.priority]) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    };

    const filteredTodos = todos.filter(todo => categories.some(cat => cat.id === todo.category));

    const calculateCategoryProgress = (categoryId) => {
        const categoryTodos = todos.filter(todo => todo.category === categoryId);
        const completedTodos = categoryTodos.filter(todo => todo.status === 'Complete');
        return categoryTodos.length === 0 ? 0 : (completedTodos.length / categoryTodos.length) * 100;
    };

    return (
        <div className="todo-list">
            <h1>TaskMaster</h1>
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'task' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('task')}
                >
                    Add New Task
                </button>
                <button 
                    className={`tab ${activeTab === 'category' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('category')}
                >
                    Add New Category
                </button>
                <button 
                    className={`tab ${activeTab === 'allTasks' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('allTasks')}
                >
                    All Tasks
                </button>
            </div>
            {activeTab === 'task' && (
                <div className="input-section">
                    {categories.length === 0 ? (
                        <p>Please add a category first before adding tasks.</p>
                    ) : (
                        <>
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
                                <option value="" disabled>Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                            <button onClick={addTodo}>Add Task</button>
                        </>
                    )}
                </div>
            )}
            {activeTab === 'category' && (
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
            )}
            {activeTab === 'allTasks' && (
                <div className="all-tasks-section">
                    <h3>All Tasks</h3>
                    <div className="tasks">
                        {sortTodosByPriorityAndDate(filteredTodos).map(todo => (
                            <div key={todo._id} className={`all-tasks-item ${todo.status === 'Complete' ? 'completed-task' : ''}`}>
                                <div className="task-info">
                                    <div className="category-label" style={{ backgroundColor: categories.find(cat => cat.id === todo.category)?.color }}>
                                        <span className="tooltiptext">{categories.find(cat => cat.id === todo.category)?.name}</span>
                                    </div>
                                    <span>{todo.text}</span>
                                </div>
                                <div className="task-actions">
                                    <input 
                                        type="date" 
                                        value={todo.dueDate ? todo.dueDate.split('T')[0] : ''} 
                                        onChange={(e) => updateTodoStatus(todo._id, todo.status, e.target.value, todo.category, todo.priority)}
                                    />
                                    <select value={todo.status} onChange={(e) => updateTodoStatus(todo._id, e.target.value, todo.dueDate, todo.category, todo.priority)}>
                                        {['Todo', 'In Progress', 'Almost Complete', 'Complete'].map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => removeTodo(todo._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {categories.map(cat => (
                activeTab !== 'allTasks' && (
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
                                        <progress value={calculateCategoryProgress(cat.id)} max="100"></progress>
                                        <div className="edit-category">
                                            <FontAwesomeIcon icon={faPencilAlt} onClick={() => startEditingCategory(cat.id, cat.name)} />
                                            <span className="tooltiptext">Edit Category</span>
                                        </div>
                                        <div className="remove-category">
                                            <FontAwesomeIcon icon={faTimes} onClick={() => removeCategory(cat.id)} />
                                            <span className="tooltiptext">Remove Category</span>
                                        </div>
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
                )
            ))}
        </div>
    );
};

export default TodoList;
