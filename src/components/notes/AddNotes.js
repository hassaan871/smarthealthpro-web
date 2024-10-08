import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="notes-container d-flex flex-column h-100">
      <h2 className="mb-3">Add a Note/Prescription</h2>
      <div className="notes-input-area mb-3">
        <textarea
          className="form-control mb-2"
          placeholder="Type your note here..."
          value={noteText}
          onChange={handleInputChange}
          rows="3"
        />
        <button onClick={handleAddNote} className="btn btn-primary">
          Add Note
        </button>
      </div>
      <div className="notes-list flex-grow-1 overflow-auto">
        {notes.length > 0 ? (
          <ul className="list-group">
            {notes.map((note, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span className="note-text">{note}</span>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="btn btn-danger btn-sm"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No notes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddNotes;