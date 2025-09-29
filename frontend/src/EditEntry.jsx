import { useState } from 'react';

function EditEntryForm({ entry, onCancel, onSave }) {
    const [title, setTitle] = useState(entry.title);
    const [content, setContent] = useState(entry.content);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:8000/entries/${entry.entry_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) throw new Error('Failed to update entry');

            const updated = await response.json();
            onSave(updated);
        } catch (error) {
            console.error(error);
            alert('Failed to update entry');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={onCancel}
                    className="ring-focus px-4 py-2 rounded-xl gradient-cancel hover:opacity-90"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditEntryForm;
