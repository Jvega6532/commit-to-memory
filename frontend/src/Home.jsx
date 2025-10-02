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
    // const [highFive, setHighFive] = useState(false);
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
            const done = list.filter(t => t.is_completed).length;
            const pct = total ? Math.round((done / total) * 100) : 0;

            const prev = prevCompletionMap.current.get(entry.entry_id) ?? 0;

            if (pct !== prev && total > 0) {
                setProgressAnimatingEntry(entry.entry_id);
                setTimeout(() => setProgressAnimatingEntry(null), 1500);
            }

            // if (pct === 100 && prev < 100 && total > 0) {
            //     setHighFive(true);
            //     const id = setTimeout(() => setHighFive(false), 1000);
            //     return () => clearTimeout(id);
            // }
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
        <div className="text-left px-4 pb-8 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full">
                {entries.map((entry) => {
                    const relatedTodos = todosByEntry.get(entry.entry_id) || [];
                    const completedTodos = relatedTodos.filter(t => t.is_completed);
                    const total = relatedTodos.length;
                    const done = completedTodos.length;
                    const pct = total ? Math.round((done / total) * 100) : 0;

                    const previewHeight = clickedProgress === entry.entry_id ? Math.min(18, (total * 1.5) + 5) : 0;

                    return (
                        <div
                            key={entry.entry_id}
                            className="relative bg-white/85 backdrop-blur border border-sky-blue/30 rounded-2xl p-6 pr-20 animate-fade-in transition-all overflow-visible dark:bg-slate-900/70 dark:border-white/10"
                            style={{ paddingBottom: clickedProgress === entry.entry_id ? `${previewHeight}rem` : '1.5rem' }}
                        >
                            {/* Calendar Icon */}
                            <div className="absolute top-3 right-3 w-14 h-16 bg-gradient-to-br from-coral to-peach rounded-lg shadow-calendar flex flex-col overflow-hidden">
                                <div className="w-full h-4 bg-ocean-deep rounded-t-lg flex items-center justify-center">
                                    <span className="text-white text-[9px] font-bold uppercase tracking-wide">
                                        {getMonthName(entry.post_date)}
                                    </span>
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="text-gray-800 text-2xl font-bold">
                                        {getDateNumber(entry.post_date)}
                                    </span>
                                </div>
                            </div>

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
                                    <h3 className="mt-1 text-lg font-semibold text-ocean-deep pr-4">
                                        <Link to={`/entries/${entry.entry_id}`} className="hover:underline">
                                            {entry.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-700 dark:text-slate-200 pr-4">{entry.content}</p>
                                    {entry.proj_link && (
                                        <a
                                            href={entry.proj_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 block text-sm text-aqua hover:underline break-all pr-4"
                                        >
                                            View Project →
                                        </a>
                                    )}

                                    {/* Progress Section */}
                                    <div
                                        className="mt-4 relative cursor-pointer"
                                        onClick={() => handleProgressClick(entry.entry_id)}
                                    >
                                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 mb-1">
                                            <span>{done}/{total} completed</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-cyan-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${progressAnimatingEntry === entry.entry_id
                                                    ? 'animate-progress-neon'
                                                    : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-500'
                                                    }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        {/* Todo Preview */}
                                        {clickedProgress === entry.entry_id && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur border border-sky-blue/30 rounded-2xl p-6 shadow-xl z-[1000] max-h-[500px] overflow-y-auto dark:bg-slate-900/98 dark:border-white/10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setClickedProgress(null);
                                                    }}
                                                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-ocean-deep text-xl"
                                                    aria-label="Close preview"
                                                >
                                                    ✕
                                                </button>
                                                <h4 className="font-semibold mb-1 text-center text-ocean-deep">
                                                    {relatedTodos.length === 0 ? '💻 Ready to Push?' :
                                                        done === total && total > 0 ? '✅ Branch Merged!' :
                                                            done === 0 ? '🚀 Time to Commit!' :
                                                                '⚡ Building...'}
                                                </h4>
                                                <p className="text-xs text-center mb-4 text-gray-600 dark:text-gray-300">
                                                    {relatedTodos.length === 0 ? 'No todos yet — initialize your first task!' :
                                                        done === total && total > 0 ? `All ${total} todos deployed!` :
                                                            done === 0 ? `${total} tasks in backlog` :
                                                                `${total - done} pending • ${done} shipped`}
                                                </p>
                                                {relatedTodos.length === 0 ? (
                                                    <p className="text-sm text-gray-500 text-center">Add your first todo to get started!</p>
                                                ) : (
                                                    <ul className="space-y-2 text-sm">
                                                        {relatedTodos.map((todo) => (
                                                            <li key={todo.todo_id} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={todo.is_completed}
                                                                    readOnly
                                                                    className="w-4 h-4"
                                                                />
                                                                <span className={todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}>
                                                                    {todo.task}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => openAddTodoModal(entry)}
                                            className="flex-1 min-w-[110px] bg-gradient-to-r from-sky-blue via-aqua to-ocean-deep text-white px-3 py-2.5 rounded-xl text-sm font-semibold shadow-coastal hover:shadow-coastal-lg transition-all hover:-translate-y-0.5 ring-focus whitespace-nowrap"
                                        >
                                            Add Todo
                                        </button>
                                        <button
                                            onClick={() => setEditingEntryId(entry.entry_id)}
                                            className="flex-1 min-w-[90px] bg-sky-blue/15 text-ocean-deep px-3 py-2.5 rounded-xl text-sm font-semibold border border-sky-blue/30 hover:bg-sky-blue/25 transition-all ring-focus dark:bg-white/10 dark:border-white/10 whitespace-nowrap"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.entry_id)}
                                            className="flex-1 min-w-[90px] bg-gradient-to-r from-[#FF6B6B] via-coral to-[#FF4500] text-white px-3 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition-all animate-scale-pop ring-focus whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    {/* Days Counter */}
                                    <div className="mt-4 pt-3 border-t border-sky-blue/30 dark:border-white/10 text-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ⏰ {getDaysOpen(entry.post_date) === 0
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

            {/* Add Todo Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={closeAddTodoModal}
                    />
                    <div className="absolute inset-0 grid place-items-center p-4">
                        <div className="bg-white/85 backdrop-blur border border-sky-blue/30 rounded-2xl w-full max-w-lg animate-slide-up dark:bg-slate-900/85 dark:border-white/10">
                            <header className="flex items-center justify-between p-4 border-b border-sky-200/60 dark:border-white/10">
                                <h3 className="text-base font-semibold text-center flex-1 text-ocean-deep">
                                    Add Todo {activeEntry ? `— ${activeEntry.title}` : ''}
                                </h3>
                                <button
                                    aria-label="Close"
                                    onClick={closeAddTodoModal}
                                    className="p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/10 ring-focus"
                                >
                                    ✕
                                </button>
                            </header>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-ocean-deep">
                                        Todo title
                                    </label>
                                    <input
                                        value={newTodoText}
                                        onChange={(e) => setNewTodoText(e.target.value)}
                                        placeholder="E.g., Write unit tests for auth"
                                        className="w-full rounded-xl border border-sky-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeAddTodoModal}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 shadow hover:opacity-90 ring-focus"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addTodo}
                                        disabled={savingTodo}
                                        className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-blue via-aqua to-ocean-deep disabled:opacity-60 ring-focus"
                                    >
                                        {savingTodo ? 'Adding…' : 'Add Todo'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* High Five Animation
            {highFive && (
                <div className="fixed inset-0 z-[60] grid place-items-center pointer-events-none">
                    <div className="relative select-none">
                        <div className="text-6xl">🖐️🤚</div>
                        <span className="absolute inset-0 -z-10 mx-auto my-auto block h-28 w-28 rounded-full border-4 border-sky-400/70 animate-highfive-burst" />
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default Home;
