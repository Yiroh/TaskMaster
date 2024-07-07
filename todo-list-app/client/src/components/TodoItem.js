import React from 'react';

const TodoItem = ({ todo }) => {
    return (
        <div>
            <input type="checkbox" checked={todo.completed} readOnly />
            {todo.text}
        </div>
    );
};

export default TodoItem;
