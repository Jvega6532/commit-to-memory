import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EditableTodo from './EditTodo.jsx';

function Entry() {
    const [entry, setEntry] = useState(null);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTodoText, setNewTodoText] = useState('');
    const { entryId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entryRes, todosRes] = await Promise.all([
                    fetch(`http://localhost:8000/entries/${entryId}`),
                    fetch(`http://localhost:8000/entries/${entryId}/todos`)
                ]);

                if (!entryRes.ok) {
                    throw new Error('Failed to fetch entry');
                }
                const entryData = await entryRes.json();
                setEntry(entryData);

                if (todosRes.status === 404) {
                    setTodos([]);
                } else if (!todosRes.ok) {
                    throw new Error('Failed to fetch todos');
                } else {
                    const todosData = await todosRes.json();
                    setTodos(todosData);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [entryId]);

    const handleAddTodo = async () => {
        if (newTodoText.trim() === '') return;

        try {
            const response = await fetch(`http://localhost:8000/entries/${entryId}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTodoText }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const newTodo = await response.json();
            setTodos((prev) => [...prev, newTodo]);
            setNewTodoText('');
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add todo');
        }
    };

    const handleUpdateTodo = (updatedTodo) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.todo_id === updatedTodo.todo_id ? updatedTodo : todo
            )
        );
    };

    const handleDeleteTodo = async (todoId) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/todos/${todoId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos((prev) => prev.filter((todo) => todo.todo_id !== todoId));
        } catch (error) {
            console.error(error);
            alert('Failed to delete todo');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!entry) {
        return <div>Entry not found</div>;
    }

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {entry.title} <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">| {entry.post_date}</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-base">
                    {entry.content}
                </p>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Todos</h3>

            {Array.isArray(todos) && todos.length === 0 ? (
                <p>No todos yet. Start by adding one above.</p>
            ) : (
                <ul>
                    {todos.map((todo) => (
                        <EditableTodo
                            key={todo.todo_id}
                            todo={todo}
                            onUpdate={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                        />
                    ))}
                </ul>
            )}


            <textarea
                placeholder="Add a todo ..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                rows={4}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
            />


            <div className="flex justify-center">
                <button
                    onClick={handleAddTodo}
                    className="ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700"
                >
                    Add Todo
                </button>
            </div>

            <br />
            <p><Link to="/">Return to Home</Link></p>
        </div>
    );
}

export default Entry;
