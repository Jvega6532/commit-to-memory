import { use, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

{/*
This page will to show the entry details in full with edit capabilities
and a list of associated todos with add, edit, delete, and mark complete
functionality
*/}

function Entry() {
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const { entryId } = useParams();

    useEffect(() => {
        async function fetchEntry() {
            fetch(`http://localhost:8000/entries/${entryId}`)
                .then(response => response.json())
                .then(data => {
                    setEntry(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching entry:', error);
                    setLoading(false);
                });
        }
        fetchEntry();

        async function fetchTodos() {
            fetch(`http://localhost:8000/entries/${entryId}/todos`)
                .then(response => response.json())
                .then(data => {
                    setTodos(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching todos:', error);
                    setLoading(false);
                });
        }
        fetchTodos();
    }, [entryId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!entry) {
        return <div>Entry not found</div>;
    }

    return (
        <div>
            <h2>{entry.title} | {entry.post_date}</h2>
            <p>{entry.content}</p>
            <h3>Todos</h3>
            <input type="text" placeholder="Add a todo ..." />   <button>Add Todo</button>
            <br></br>
            <br></br>
            <ul>
                {todos.map(todo => (
                    <li key={todo.todo_id}>
                        <p>{todo.task}                     <input type="checkbox" checked={todo.completed} /></p>                         <br></br>
                        <button>Edit Todo</button> <button>Delete Todo</button>
                    </li>
                ))}
            </ul>

            <br></br>
            <br></br>
            <p><Link to="/">Return to Home</Link></p>

        </div>
    );
}

export default Entry;
