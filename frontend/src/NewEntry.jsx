import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function NewEntry() {

    const navigate = useNavigate();
    const handleAddEntry = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newEntry = {
            title: formData.get("title"),
            content: formData.get("content"),
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
            <h2>New Journal Entry</h2>
            <form onSubmit={handleAddEntry}>
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
