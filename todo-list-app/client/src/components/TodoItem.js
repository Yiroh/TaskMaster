import React from 'react';

const TodoItem = ({ todo, updateStatus, removeTodo }) => {
    const statuses = ['Todo', 'In Progress', 'Almost Complete', 'Complete'];

    const handleStatusChange = (e) => {
        updateStatus(todo.id, e.target.value, todo.dueDate, todo.categoryId, todo.priority);
    };
      
    const handleDueDateChange = (e) => {
        updateStatus(todo.id, todo.status, e.target.value, todo.categoryId, todo.priority);
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
                <button onClick={() => removeTodo(todo.id)}>Remove</button>
            </div>
        </div>
    );
};

export default TodoItem;
