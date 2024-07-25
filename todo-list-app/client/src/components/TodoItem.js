import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const TodoItem = ({ todo, updateStatus, removeTodo }) => {
    const statuses = ['Todo', 'In Progress', 'Almost Complete', 'Complete'];

    const handleStatusChange = (e) => {
        updateStatus(todo._id, e.target.value, todo.dueDate, todo.category, todo.priority, todo.recurrence);
    };

    const handleDueDateChange = (e) => {
        updateStatus(todo._id, todo.status, e.target.value, todo.category, todo.priority, todo.recurrence);
    };

    return (
        <div className="todo-item">
            <div className="task-info">
                <span>{todo.text}</span>
                {todo.recurrence !== 'None' && (
                    <div className="recurrence-info">
                        <FontAwesomeIcon icon={faClock} className="recurrence-icon" />
                        <span className="tooltiptext">Recurs {todo.recurrence.toLowerCase()}</span>
                    </div>
                )}
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
                <button onClick={() => removeTodo(todo._id)}>Remove</button>
            </div>
        </div>
    );
};

export default TodoItem;
