import { Link } from "react-router";
{/*
    This will be the form for adding a new entry
    to the entry database table
    */}

function NewEntry() {
    return (
        <div>
            <h2>New Journal Entry</h2>
            <form>
                <label>
                    Title:
                    <input type="text" name="title" />
                </label>
                <br></br>
                <br />
                <label>
                    Content:
                    <textarea name="content" />
                </label>
                <br />
                <br></br>
                <button type="submit">Add Entry</button>
                <button type="reset">Clear</button>
                <p><Link to="/">Return to Home</Link></p>
            </form>
        </div>
    );
}

export default NewEntry;
