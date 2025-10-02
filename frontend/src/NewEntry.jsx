import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function NewEntry() {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState('');

    const handleAddEntry = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newEntry = {
            title: formData.get("title"),
            content: formData.get("content"),
            proj_link: formData.get("proj_link"),
        };

        try {
            const response = await fetch('http://localhost:8000/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Entry added successfully:', result);

            // Add todos if any exist
            if (todos.length > 0) {
                for (const todo of todos) {
                    await fetch(`http://localhost:8000/entries/${result.entry_id}/todos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ task: todo.task }),
                    });
                }
            }

            navigate('/entries/' + result.entry_id);

        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handleAddTodo = () => {
        if (newTodoText.trim() === '') return;

        setTodos([...todos, { id: Date.now(), task: newTodoText }]);
        setNewTodoText('');
    };

    const handleRemoveTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-ocean-deep">
                        Project Link:
                    </label>
                    <input
                        type="text"
                        name="proj_link"
                        placeholder="https://example.com/project"
                        className="block w-full p-3 border border-sky-300 rounded-lg bg-white/80 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ring-focus"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-ocean-deep">
                        Title:
                    </label>
                    <input
                        type="text"
                        name="title"
                        className="block w-full p-3 border border-sky-300 rounded-lg bg-white/80 text-base ring-focus dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Give your entry a title..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-ocean-deep">
                        Content:
                    </label>
                    <textarea
                        name="content"
                        rows="6"
                        className="block p-3 w-full text-sm border border-sky-300 bg-white/80 rounded-lg ring-focus dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Write your thoughts here..."
                    />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium mb-2 text-ocean-deep">
                        Todos (optional):
                    </label>

                    {todos.length > 0 && (
                        <ul className="mb-3 space-y-2">
                            {todos.map((todo) => (
                                <li key={todo.id} className="flex items-center justify-between p-2 bg-white/80 border border-sky-200 rounded-lg">
                                    <span className="text-sm">{todo.task}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTodo(todo.id)}
                                        className="text-red-500 hover:text-red-700 text-sm transition-colors"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="Add a todo..."
                            className="flex-1 p-3 border border-sky-300 rounded-lg bg-white/80 ring-focus"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTodo();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddTodo}
                            className="bg-gradient-to-r from-sky-blue via-aqua to-ocean-deep text-white px-4 py-2 rounded-xl font-semibold shadow-coastal hover:shadow-coastal-lg transition-all hover:-translate-y-0.5 ring-focus"
                        >
                            Add
                        </button>
                    </div>
                </div> */}

                <div className="flex gap-3 pt-2 justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-sky-blue via-aqua to-ocean-deep text-white px-6 py-3 rounded-xl font-semibold shadow-coastal hover:shadow-coastal-lg transition-all hover:-translate-y-0.5 ring-focus">
                        Save Entry
                    </button>
                    <button
                        type="reset"
                        onClick={() => {
                            setTodos([]);
                            setNewTodoText('');
                        }}
                        className="bg-sky-blue/15 text-ocean-deep px-6 py-3 rounded-xl font-semibold border border-sky-blue/30 hover:bg-sky-blue/25 transition-all ring-focus">
                        Clear
                    </button>
                </div>

                <div className="pt-4 text-center">
                    <Link to="/" className="text-aqua hover:underline text-sm">
                        ← Return to Home
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default NewEntry;
