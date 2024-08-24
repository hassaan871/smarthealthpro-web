// AddNotes.js
import React, { useState } from 'react';
import './AddNotes.css';

const AddNotes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  const handleInputChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      setNotes([...notes, noteText.trim()]);
      setNoteText('');
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="add-notes-container">
      <h2>Add a Note</h2>
      <div className="note-input-container">
        <textarea
          placeholder="Type your note here..."
          value={noteText}
          onChange={handleInputChange}
          rows="6"
          className="note-input"
        />
        <button onClick={handleAddNote} className="add-note-button">Add Note</button>
      </div>
      <div className="notes-list-container">
        {notes.length > 0 ? (
          <ul className="notes-list">
            {notes.map((note, index) => (
              <li key={index} className="note-item">
                <p className="note-text">{note}</p>
                <button onClick={() => handleDeleteNote(index)} className="delete-note-button">
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notes">No notes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddNotes;
