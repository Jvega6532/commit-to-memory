import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/entries')
            .then(response => response.json())
            .then(data => {
                setEntries(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching entries:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Entries</h2>
            {entries.map(entry => (

                <div key={entry.entry_id}>
                    <p><Link to={`/entries/${entry.entry_id}`}>{entry.title}</Link> | {entry.post_date} | <button>0/5</button></p>
                    <p>{entry.content}</p>
                    <button>Delete Entry</button>      <button>Edit Entry</button>
                                       
                    {/*
                    Delete button
                    Todo Tracker
                    Click for Todos
                    Edit Entry
                    */}
                    <br></br>
                </div>

            ))}
        </div>
    );
}

export default Home;
