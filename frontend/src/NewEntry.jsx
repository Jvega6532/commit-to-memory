import { Link, useNavigate } from "react-router-dom";


function NewEntry() {
    const navigate = useNavigate();

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


            navigate('/entries/' + result.entry_id);

        } catch (error) {
            console.error('Error adding entry:', error);
        }
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


                <div className="flex gap-3 pt-2 justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                        Save Entry
                    </button>
                    <button
                        type="reset"
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
