import { Link } from "react-router";
import React, { useState } from "react";
{/*
    This will be the form for adding a new entry
    to the entry database table
    */}

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
        // Optionally, redirect to the home page or clear the form

    } catch (error) {
        console.error('Error adding entry:', error);
    }
}; 

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
