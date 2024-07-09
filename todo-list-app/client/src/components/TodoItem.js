import React from 'react';

const TodoItem = ({ todo, updateStatus }) => {
    const statuses = ['Todo', 'In Progress', 'Almost Complete', 'Complete'];

    const handleStatusChange = (e) => {
        updateStatus(todo._id, e.target.value, todo.dueDate);
    };

    const handleDueDateChange = (e) => {
        updateStatus(todo._id, todo.status, e.target.value);
    };

    return (
        <tr className="todo-item">
            <td>{todo.text}</td>
            <td>
                <input 
                    type="date" 
                    value={todo.dueDate ? todo.dueDate.split('T')[0] : ''} 
                    onChange={handleDueDateChange} 
                />
            </td>
            <td>
                <select 
                    value={todo.status} 
                    onChange={handleStatusChange}
                >
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </td>
            <td>
                {/* TODO add Edit and Remove buttons here (make them function) */}
                <button>Edit</button>
                <button>Remove</button>
            </td>
        </tr>
    );
};

export default TodoItem;
