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
        <li>
            <label>
                <input type="checkbox" checked={todo.is_completed} onChange={handleCheckboxChange} />
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        style={{ width: '100%', marginBottom: '0.5rem' }}

                    />
                ) : (
                    todo.task
                )}
            </label>

            {isEditing ? (
                <>
                    <button onClick={handleSaveClick} disabled={loading}>Save</button>
                    <button onClick={handleCancelClick} disabled={loading}>Cancel</button>
                </>
            ) : (
                <>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => onDelete(todo.todo_id)}>Delete</button>
                </>
            )}
        </li>
    );
}

export default EditableTodo;
