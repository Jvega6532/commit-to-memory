import { useState } from 'react';

function EditEntryForm({ entry, onCancel, onSave }) {
    const [title, setTitle] = useState(entry.title);
    const [content, setContent] = useState(entry.content);
    const [projLink, setProjLink] = useState(entry.proj_link || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:8000/entries/${entry.entry_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, proj_link: projLink }),
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
                className="w-full rounded-xl border border-sky-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
                placeholder="Title"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-sky-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
                placeholder="Content"
            />
            <input
                type="url"
                value={projLink}
                onChange={(e) => setProjLink(e.target.value)}
                className="w-full rounded-xl border border-sky-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm ring-focus mb-2"
                placeholder="Project link (URL)"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow hover:opacity-90 ring-focus"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditEntryForm;
