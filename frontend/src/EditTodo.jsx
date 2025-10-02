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
        <li className="bg-white/85 backdrop-blur border border-sky-blue/30 rounded-2xl p-4 flex items-center space-x-4 dark:bg-slate-900/70 dark:border-white/10">
            <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={handleCheckboxChange}
                className="w-5 h-5 rounded ring-focus accent-aqua cursor-pointer"
            />

            <div className="flex-grow">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="w-full p-2 border border-sky-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ring-focus"
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
                            className="bg-gradient-to-r from-sky-blue via-aqua to-ocean-deep text-white px-3 py-1 rounded-xl font-semibold disabled:opacity-60 ring-focus"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            disabled={loading}
                            className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 px-3 py-1 rounded-xl shadow disabled:opacity-60 ring-focus"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-sky-blue/15 text-ocean-deep px-3 py-1 rounded-xl font-semibold border border-sky-blue/30 hover:bg-sky-blue/25 transition-all ring-focus"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(todo.todo_id)}
                            className="bg-gradient-to-r from-[#FF6B6B] via-coral to-[#FF4500] text-white px-3 py-1 rounded-xl font-semibold hover:opacity-90 transition-all animate-scale-pop ring-focus"
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