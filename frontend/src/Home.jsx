import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch('http://localhost:8000/entries');
                const data = await response.json();
                setEntries(data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, []);

    const handleDeleteEntry = async (entryId) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/entries/${entryId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to delete entry');

            setEntries((prevEntries) => prevEntries.filter((entry) => entry.entry_id !== entryId));
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

    const cancelEditing = () => {
        setEditingEntryId(null);
    };

    const saveEditing = async () => {
        try {
            const response = await fetch(`http://localhost:8000/entries/${editingEntryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editedTitle,
                    content: editedContent,
                }),
            });

            if (!response.ok) throw new Error('Failed to update entry');

            const updatedEntry = await response.json();

            setEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry.entry_id === updatedEntry.entry_id ? updatedEntry : entry
                )
            );
            setEditingEntryId(null);
        } catch (error) {
            console.error(error);
            alert('Failed to update entry');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Entries</h2>
            {entries.map((entry) =>
                editingEntryId === entry.entry_id ? (
                    <div
                        key={entry.entry_id}
                    >
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            style={{ width: '100%', marginBottom: '0.5rem' }}
                        />
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={4}
                            style={{ width: '100%', marginBottom: '0.5rem' }}
                        />
                        <button onClick={saveEditing}>Save</button>{' '}
                        <button onClick={cancelEditing}>Cancel</button>
                    </div>
                ) : (
                    <div
                        key={entry.entry_id}
                    >
                        <p>
                            <Link to={`/entries/${entry.entry_id}`}>
                                <strong>{entry.title}</strong>
                            </Link>{' '}
                            | {entry.post_date} | <button>0/5</button>
                        </p>
                        <p>{entry.content}</p>
                        <button onClick={() => handleDeleteEntry(entry.entry_id)}>
                            Delete Entry
                        </button>{' '}
                        <button onClick={() => startEditing(entry)}>Edit Entry</button>
                    </div>
                )
            )}
        </div>
    );
}

export default Home;
