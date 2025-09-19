import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EditableTodo from './EditTodo.jsx';

function Entry() {
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const { entryId } = useParams();

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await fetch(`http://localhost:8000/entries/${entryId}`);
                const data = await response.json();
                console.log(data);
                setEntry(data);
            } catch (error) {
                console.error('Error fetching entry:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [entryId]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:8000/entries/${entryId}/todos`);

                if (response.status === 404) {
                    setTodos([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }

                const data = await response.json();
                console.log(data);
                setTodos(data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        fetchTodos();




    }, [entryId]);
    const handleUpdateTodo = (updatedTodo) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.todo_id === updatedTodo.todo_id ? updatedTodo : todo
            )
        );
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            const response = await fetch(`http://localhost:8000/todos/${todoId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos((prevTodos) => prevTodos.filter((todo) => todo.todo_id !== todoId));
        } catch (error) {
            console.error(error);
            alert('Failed to delete todo');
        }
    };
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

            <input type="text" placeholder="Add a todo ..." />
            <button>Add Todo</button>

            {Array.isArray(todos) && todos.length === 0 ? (
                <p>No todos yet. Start by adding one above.</p>
            ) : Array.isArray(todos) ? (
                <ul>
                    {todos.map((todo) => (
                        <EditableTodo
                            key={todo.todo_id}
                            todo={todo}
                            onUpdate={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                        />
                    ))}
                </ul>
            ) : (
                <p>No todos available</p>
            )}

            <br />
            <br />
            <p><Link to="/">Return to Home</Link></p>
        </div>
    );
}

// todo check box  functionality



// add todo functionality functionaly
function addTodo() {
    // get the value from the input field
    const todoInput = document.querySelector('input[type="text"]');
    const todoText = todoInput.value;

    // clear the input field
    todoInput.value = '';

    // add the todo to the list
    console.log('Adding todo:', todoText);
}
// add event listener to the button
const addButton = document.querySelector('button');
if (addButton) {
    addButton.addEventListener('click', addTodo);
}

export default Entry;


