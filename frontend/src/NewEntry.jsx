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
        <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">New Journal Entry</h2>
            <form onSubmit={handleAddEntry}>
                <label >
                    Project Link:
                    <input
                        type="text"
                        name="proj_link"
                        placeholder="https://example.com/project"
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </label>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Give your entry a title..."
                    />
                </label>
                <br></br>
                <br />
                <label>
                    Content:
                    <textarea
                        name="content"
                        rows="6"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your thoughts here..."
                    />
                </label>
                <br />
                <br></br>
                <button
                    type="submit"
                    className="mr-2 ring-focus px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700">
                    Add Entry
                </button>
                <button
                    type="reset"
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Clear
                </button>
                <br></br>
                <p><Link to="/">Return to Home</Link></p>
            </form>
        </div>
    );
}

export default NewEntry;
