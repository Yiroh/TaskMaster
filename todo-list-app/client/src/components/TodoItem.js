import React from 'react';

const TodoItem = ({ todo, updateStatus, removeTodo }) => {
    const statuses = ['Todo', 'In Progress', 'Almost Complete', 'Complete'];

    const handleStatusChange = (e) => {
        updateStatus(todo._id, e.target.value, todo.dueDate, todo.category);
    };

    const handleDueDateChange = (e) => {
        updateStatus(todo._id, todo.status, e.target.value, todo.category);
    };

    return (
        <div className="todo-item">
            <div className="task-info">
                <span>{todo.text}</span>
            </div>
            <div className="task-actions">
                <input 
                    type="date" 
                    value={todo.dueDate ? todo.dueDate.split('T')[0] : ''} 
                    onChange={handleDueDateChange} 
                />
                <select value={todo.status} onChange={handleStatusChange}>
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="task-buttons">
                <button onClick={() => removeTodo(todo._id)}>Remove</button>
            </div>
        </div>
    );
};

export default TodoItem;
