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
        const confirmed = window.confirm('Are you sure you want to delete this todo?');
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
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!entry) {
        return <div className="text-center py-12">Entry not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/85 backdrop-blur border border-sky-blue/30 rounded-2xl p-6 mb-6 dark:bg-slate-900/70 dark:border-white/10">
                <h2 className="text-2xl font-semibold mb-2 text-ocean-deep">
                    {entry.title}
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-sm ml-2">
                        | {entry.post_date}
                    </span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-3">
                    {entry.content}
                </p>
                {entry.proj_link && (
                    <p className="break-all">
                        <a
                            href={entry.proj_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-aqua hover:underline"
                        >
                            {entry.proj_link}
                        </a>
                    </p>
                )}
            </div>

            <h3 className="text-xl font-semibold mb-4 text-ocean-deep">
                Todos
            </h3>

            {Array.isArray(todos) && todos.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No todos yet. Start by adding one below.
                </p>
            ) : (
                <ul className="space-y-3 mb-6">
                    {[...todos]
                        .sort((a, b) => a.completion - b.completion)
                        .map((todo) => (
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
                className="block w-full p-4 border border-sky-300 rounded-lg bg-white/80 text-base ring-focus dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mb-4"
            />

            <div className="flex justify-center mb-6">
                <button
                    onClick={handleAddTodo}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    Add Todo
                </button>
            </div>

            <div className="text-center">
                <Link to="/" className="text-aqua hover:underline text-sm">
                    ← Return to Home
                </Link>
            </div>
        </div>
    );
}

export default Entry;
