import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EditEntryForm from './EditEntry';

function Home() {
    const [entries, setEntries] = useState([]);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeEntry, setActiveEntry] = useState(null);
    const [newTodoText, setNewTodoText] = useState('');
    const [savingTodo, setSavingTodo] = useState(false);
    const prevCompletionMap = useRef(new Map());
    const [progressAnimatingEntry, setProgressAnimatingEntry] = useState(null);
    const [clickedProgress, setClickedProgress] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesRes, todosRes] = await Promise.all([
                    fetch('http://localhost:8000/entries'),
                    fetch('http://localhost:8000/todos'),
                ]);
                const entriesData = await entriesRes.json();
                const todosData = await todosRes.json();

                const sortedEntries = entriesData.sort(
                    (a, b) => new Date(b.post_date) - new Date(a.post_date)
                );

                setEntries(sortedEntries);
                setTodos(todosData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const todosByEntry = useMemo(() => {
        const map = new Map();
        for (const t of todos) {
            const list = map.get(t.entry_id) || [];
            list.push(t);
            map.set(t.entry_id, list);
        }
        return map;
    }, [todos]);

    useEffect(() => {
        entries.forEach((entry) => {
            const list = todosByEntry.get(entry.entry_id) || [];
            const total = list.length;
            const done = list.filter(t => t.completion).length;
            const pct = total ? Math.round((done / total) * 100) : 0;

            const prev = prevCompletionMap.current.get(entry.entry_id) ?? 0;

            if (pct !== prev && total > 0) {
                setProgressAnimatingEntry(entry.entry_id);
                setTimeout(() => setProgressAnimatingEntry(null), 1500);
            }

            prevCompletionMap.current.set(entry.entry_id, pct);
        });
    }, [entries, todos, todosByEntry]);

    const handleDeleteEntry = async (entryId) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/entries/${entryId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to delete entry');

            setEntries((prev) => prev.filter((e) => e.entry_id !== entryId));
            setTodos((prev) => prev.filter((t) => t.entry_id !== entryId));
        } catch (error) {
            console.error(error);
            alert('Failed to delete entry');
        }
    };

    const openAddTodoModal = (entry) => {
        setActiveEntry(entry);
        setNewTodoText('');
        setModalOpen(true);
    };

    const closeAddTodoModal = () => setModalOpen(false);

    const addTodo = async (e) => {
        e?.preventDefault();
        if (!activeEntry || !newTodoText.trim()) return;

        try {
            setSavingTodo(true);

            let res = await fetch(`http://localhost:8000/entries/${activeEntry.entry_id}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: newTodoText.trim() })
            });

            if (!res.ok) throw new Error('Failed to add todo');

            const created = await res.json();

            setTodos((prev) => [created, ...prev]);
            setModalOpen(false);
            setNewTodoText('');
        } catch (err) {
            console.error(err);
            alert('Unable to add todo');
        } finally {
            setSavingTodo(false);
        }
    };

    const handleProgressClick = (entryId) => {
        setClickedProgress(clickedProgress === entryId ? null : entryId);
    };

    const handleTodoToggle = async (todo) => {
        try {
            const response = await fetch(`http://localhost:8000/todos/${todo.todo_id}/complete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completion: !todo.completion }),
            });

            if (!response.ok) throw new Error('Failed to update todo');

            const updatedTodo = await response.json();

            setTodos((prev) =>
                prev.map((t) => (t.todo_id === updatedTodo.todo_id ? updatedTodo : t))
            );
        } catch (error) {
            console.error(error);
            alert('Failed to update todo status');
        }
    };

    const getDateNumber = (dateString) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    const getMonthName = (dateString) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[date.getMonth()];
    };

    const getDaysOpen = (dateString) => {
        const postDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - postDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {entries.map((entry) => {
                    const relatedTodos = todosByEntry.get(entry.entry_id) || [];
                    const completedTodos = relatedTodos.filter(t => t.completion);
                    const total = relatedTodos.length;
                    const done = completedTodos.length;
                    const pct = total ? Math.round((done / total) * 100) : 0;

                    const previewHeight = clickedProgress === entry.entry_id ? Math.min(20, (total * 1.8) + 8) : 0;

                    return (
                        <div
                            key={entry.entry_id}
                            className="relative bg-white/90 backdrop-blur border border-sky-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                            style={{ paddingBottom: clickedProgress === entry.entry_id ? `${previewHeight}rem` : '1.5rem' }}
                        >

                            {editingEntryId === entry.entry_id ? (
                                <EditEntryForm
                                    entry={entry}
                                    onCancel={() => setEditingEntryId(null)}
                                    onSave={(updatedEntry) => {
                                        setEntries((prev) =>
                                            prev.map((e) => (e.entry_id === updatedEntry.entry_id ? updatedEntry : e))
                                        );
                                        setEditingEntryId(null);
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="absolute top-4 right-4 w-16 h-20 rounded-xl shadow-lg flex flex-col overflow-hidden border-2 border-sky-100">
                                        <div className="w-full h-6 bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold uppercase tracking-wider">
                                                {getMonthName(entry.post_date)}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500">
                                            <span className="text-white text-3xl font-bold drop-shadow-md">
                                                {getDateNumber(entry.post_date)}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-600 pr-20 mb-3">
                                        <Link to={`/entries/${entry.entry_id}`} className="hover:text-blue-700 hover:underline">
                                            {entry.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-700 pr-20 mb-3">{entry.content}</p>
                                    {entry.proj_link && (
                                        <a
                                            href={entry.proj_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline break-all pr-20 block mb-4"
                                        >
                                            View Project &rarr;
                                        </a>
                                    )}

                                    <div
                                        className="mt-4 relative cursor-pointer group"
                                        onClick={() => handleProgressClick(entry.entry_id)}
                                    >
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-medium">
                                            <span>{done}/{total} completed</span>
                                            <span className="text-lg font-bold">{pct}%</span>
                                        </div>
                                        <div className="w-full h-4 bg-cyan-50 rounded-full overflow-hidden border border-cyan-100 shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${progressAnimatingEntry === entry.entry_id
                                                    ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500 shadow-lg'
                                                    : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500'
                                                    }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-center group-hover:text-gray-700">
                                            {clickedProgress === entry.entry_id ? 'Click to hide todos' : 'Click to view todos'}
                                        </p>

                                        {clickedProgress === entry.entry_id && (
                                            <div
                                                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl p-6 shadow-2xl z-[1000] max-h-[400px] overflow-y-auto border-2 border-cyan-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setClickedProgress(null);
                                                    }}
                                                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 text-xl font-bold"
                                                    aria-label="Close preview"
                                                >
                                                    &times;
                                                </button>
                                                <div className="text-center mb-4">
                                                    <h4 className="text-lg font-bold text-blue-600 mb-1">
                                                        {relatedTodos.length === 0 ? 'Ready to Push?' :
                                                            done === total && total > 0 ? 'Branch Merged!' :
                                                                done === 0 ? 'Time to Commit!' :
                                                                    'Building...'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {relatedTodos.length === 0 ? 'No todos yet - initialize your first task!' :
                                                            done === total && total > 0 ? `All ${total} todos deployed!` :
                                                                done === 0 ? `${total} tasks in backlog` :
                                                                    `${total - done} pending, ${done} shipped`}
                                                    </p>
                                                </div>
                                                {relatedTodos.length === 0 ? (
                                                    <p className="text-sm text-gray-500 text-center py-4">Add your first todo to get started!</p>
                                                ) : (
                                                    <ul className="space-y-3">
                                                        {[...relatedTodos]
                                                            .sort((a, b) => a.completion - b.completion)
                                                            .map((todo) => (
                                                                <li
                                                                    key={todo.todo_id}
                                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                                                    onClick={() => handleTodoToggle(todo)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={todo.completion}
                                                                        onChange={() => handleTodoToggle(todo)}
                                                                        className="w-5 h-5 rounded border-2 border-cyan-400 text-cyan-500 focus:ring-2 focus:ring-cyan-300 cursor-pointer"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <span className={`flex-1 ${todo.completion ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                                                                        {todo.task}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => openAddTodoModal(entry)}
                                            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                        >
                                            Add Todo
                                        </button>
                                        <button
                                            onClick={() => setEditingEntryId(entry.entry_id)}
                                            className="bg-cyan-50 text-cyan-700 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-cyan-200 hover:bg-cyan-100 transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.entry_id)}
                                            className="bg-gradient-to-r from-red-400 to-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                        <p className="text-xs text-gray-500">
                                            {getDaysOpen(entry.post_date) === 0
                                                ? 'Freshly initialized today!'
                                                : getDaysOpen(entry.post_date) === 1
                                                    ? 'Still compiling... 1 day in production'
                                                    : `Runtime: ${getDaysOpen(entry.post_date)} days in production`}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={closeAddTodoModal}
                    />
                    <div className="absolute inset-0 grid place-items-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200">
                            <header className="flex items-center justify-between p-5 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Add Todo {activeEntry ? `- ${activeEntry.title}` : ''}
                                </h3>
                                <button
                                    aria-label="Close"
                                    onClick={closeAddTodoModal}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                                >
                                    &times;
                                </button>
                            </header>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Todo title
                                    </label>
                                    <input
                                        value={newTodoText}
                                        onChange={(e) => setNewTodoText(e.target.value)}
                                        placeholder="E.g., Write unit tests for auth"
                                        className="w-full rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 px-4 py-3 text-sm transition-all"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeAddTodoModal}
                                        className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addTodo}
                                        disabled={savingTodo}
                                        className="px-5 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        {savingTodo ? 'Adding...' : 'Add Todo'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;
