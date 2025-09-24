import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [entries, setEntries] = useState([]);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [activeEntry, setActiveEntry] = useState(null);
    const [newTodoText, setNewTodoText] = useState('');
    const [savingTodo, setSavingTodo] = useState(false);


    const [highFive, setHighFive] = useState(false);
    const prevCompletionMap = useRef(new Map());

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
            const done = list.filter(t => t.is_completed).length;
            const pct = total ? Math.round((done / total) * 100) : 0;

            const prev = prevCompletionMap.current.get(entry.entry_id) ?? 0;
            if (pct === 100 && prev < 100 && total > 0) {
                setHighFive(true);
                // auto close after a bit
                const id = setTimeout(() => setHighFive(false), 1000);
                return () => clearTimeout(id);
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
            setTodos((prev) => prev.filter((t) => t.entry_id !== entryId)); // clean up
        } catch (error) {
            console.error(error);
            alert('Failed to delete entry');
        }
    };

    const startEditing = (entry) => {
        setEditingEntryId(entry.entry_id);
        setEditedTitle(entry.title);
        setEditedContent(entry.content);
    };
    const cancelEditing = () => setEditingEntryId(null);

    const saveEditing = async () => {
        try {
            const response = await fetch(`http://localhost:8000/entries/${editingEntryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editedTitle, content: editedContent }),
            });
            if (!response.ok) throw new Error('Failed to update entry');

            const updatedEntry = await response.json();
            setEntries((prev) =>
                prev.map((e) => (e.entry_id === updatedEntry.entry_id ? updatedEntry : e))
            );
            setEditingEntryId(null);
        } catch (error) {
            console.error(error);
            alert('Failed to update entry');
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="text-left">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Entries</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {entries.map((entry) => {
                    const relatedTodos = todosByEntry.get(entry.entry_id) || [];
                    const completedTodos = relatedTodos.filter(t => t.is_completed);
                    const total = relatedTodos.length;
                    const done = completedTodos.length;
                    const pct = total ? Math.round((done / total) * 100) : 0;

                    return (
                        <div key={entry.entry_id} className="surface p-5 fade-in hover:shadow-lg transition">
                            {editingEntryId === entry.entry_id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
                                    />
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={saveEditing} className="ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700">Save</button>
                                        <button onClick={cancelEditing} className="ring-focus px-4 py-2 rounded-xl bg-slate-900/5 dark:bg-white/10">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">{entry.post_date}</p>
                                    <h3 className="mt-1 text-lg font-semibold">
                                        <Link to={`/entries/${entry.entry_id}`} className="hover:underline">{entry.title}</Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{entry.content}</p>

                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                                            <span>{done}/{total} completed</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => openAddTodoModal(entry)}
                                            className="ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700"
                                        >
                                            Add Todo
                                        </button>
                                        <button
                                            onClick={() => startEditing(entry)}
                                            className="ring-focus px-4 py-2 rounded-xl bg-slate-900/5 dark:bg-white/10"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.entry_id)}
                                            className="ring-focus px-4 py-2 rounded-xl gradient-danger hover:opacity-90 scale-pop"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ---- Add Todo Modal ---- */}
            {modalOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={closeAddTodoModal}
                    />
                    <div className="absolute inset-0 grid place-items-center p-4">
                        <div className="surface w-full max-w-lg slide-up">
                            <header className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-white/10">
                                <h3 className="text-base font-semibold">
                                    Add Todo {activeEntry ? `– ${activeEntry.title}` : ''}
                                </h3>
                                <button
                                    aria-label="Close"
                                    onClick={closeAddTodoModal}
                                    className="p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/10 ring-focus"
                                >
                                    ✕
                                </button>
                            </header>
                            <form onSubmit={addTodo} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Todo title</label>
                                    <input
                                        value={newTodoText}
                                        onChange={(e) => setNewTodoText(e.target.value)}
                                        placeholder="E.g., Write unit tests for auth"
                                        className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeAddTodoModal}
                                        className="ring-focus px-4 py-2 rounded-xl bg-slate-900/5 dark:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingTodo}
                                        className="ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 disabled:opacity-60"
                                    >
                                        {savingTodo ? 'Adding…' : 'Add Todo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Virtual High Five celebration ---- */}
            {highFive && (
                <div className="fixed inset-0 z-[60] grid place-items-center pointer-events-none">
                    <div className="relative select-none">
                        <div className="text-6xl">🖐️🤚</div>
                        <span className="absolute inset-0 -z-10 mx-auto my-auto block h-28 w-28 rounded-full border-4 border-sky-400/70 highfive-burst" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
