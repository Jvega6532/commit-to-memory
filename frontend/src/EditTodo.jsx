import { useState } from 'react';

function EditableTodo({ todo, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(todo.task);
    const [loading, setLoading] = useState(false);

    const handleSaveClick = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/todos/${todo.todo_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: editedTask }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            onUpdate(updatedTodo);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setEditedTask(todo.task);
        setIsEditing(false);
    };

    const handleCheckboxChange = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/todos/${todo.todo_id}/complete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_completed: !todo.is_completed }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            onUpdate(updatedTodo);
        } catch (error) {
            console.error(error);
            alert('Failed to update todo status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <li className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4 mb-4 flex items-center space-x-4">
            <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            <div className="flex-grow">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                ) : (
                    <span className={`select-none ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {todo.task}
                    </span>
                )}
            </div>

            <div className="flex space-x-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            disabled={loading}
                            className="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-blue-300"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            disabled={loading}
                            className="px-3 py-1 rounded bg-gray-400 text-white disabled:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(todo.todo_id)}
                            className="ring-focus px-4 py-2 rounded-xl gradient-danger hover:opacity-90 scale-pop"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </li>

    );
}

export default EditableTodo;
