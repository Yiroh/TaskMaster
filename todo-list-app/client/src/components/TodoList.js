import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { SERVER_URL } from '../config';

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
    loadTodos();
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && category === null) {
      setCategory(categories[0].id); // Set to the first category's ID
    }
  }, [categories]);

  const loadTodos = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addTodo = async () => {
    if (text.trim() === '' || category === null) {
      console.log("Empty task or no category selected, not adding");
      return;
    }
    const newTodo = { text, dueDate, categoryId: category, priority, status: 'Todo' };
    try {
      const response = await axios.post(`${SERVER_URL}/todos`, newTodo);
      setTodos([...todos, response.data]);
      setText('');
      setDueDate('');
      setPriority('Medium');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  

  const updateTodoStatus = async (id, status, dueDate, categoryId, priority) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/todos/${id}`, { status, dueDate, categoryId, priority });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };  

  const removeTodo = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() === '') {
      console.log("Empty category name, not adding");
      return;
    }
    const categoryData = { name: newCategory, color: newCategoryColor };
    try {
      const response = await axios.post(`${SERVER_URL}/categories`, categoryData);
      setCategories([...categories, response.data]);
      setNewCategory('');
      setNewCategoryColor('#000000');
      setCategory(response.data.id); // Set the selected category to the new category's ID
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const removeCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${SERVER_URL}/categories/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
        setTodos(todos.filter(todo => todo.categoryId !== id));
        if (category === id) setCategory(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const startEditingCategory = (id, name) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const saveCategoryName = async (id) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/categories/${id}`, { name: editingCategoryName });
      setCategories(categories.map(cat => cat.id === id ? response.data : cat));
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const calculateCategoryProgress = (categoryId) => {
    const categoryTodos = todos.filter(todo => todo.categoryId === categoryId);
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
            {todos.map(todo => {
              // Find the category associated with this todo
              const category = categories.find(cat => cat.id === todo.categoryId);

              return (
                <div
                  key={todo.id}
                  className={`all-tasks-item ${todo.status === 'Complete' ? 'completed-task' : ''}`}
                >
                  <div className="task-info">
                    {category && (
                      <div
                        className="category-label"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="tooltiptext">{category.name}</span>
                      </div>
                    )}
                    <span>{todo.text}</span>
                  </div>
                  <div className="task-actions">
                    <input
                      type="date"
                      value={todo.dueDate ? todo.dueDate.split('T')[0] : ''}
                      onChange={(e) =>
                        updateTodoStatus(
                          todo.id,
                          todo.status,
                          e.target.value,
                          todo.categoryId,
                          todo.priority
                        )
                      }
                    />
                    <select
                      value={todo.status}
                      onChange={(e) =>
                        updateTodoStatus(
                          todo.id,
                          e.target.value,
                          todo.dueDate,
                          todo.categoryId,
                          todo.priority
                        )
                      }
                    >
                      {['Todo', 'In Progress', 'Almost Complete', 'Complete'].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                    <button onClick={() => removeTodo(todo.id)}>Remove</button>
                  </div>
                </div>
              );
            })}
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
              {todos.filter(todo => todo.categoryId === cat.id).map(todo => (
                <TodoItem 
                  key={todo.id} 
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
