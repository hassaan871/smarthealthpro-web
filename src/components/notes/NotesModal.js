import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Context from "../context/context";
import { encrypt, decrypt } from "../encrypt/Encrypt";

const NotesModal = ({ show, onHide, appointment }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { userInfo } = useContext(Context);

  const modalStyles = `
    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    
    .highlight-new {
      animation: highlightNew 1s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes highlightNew {
      0% { background-color: rgb(34, 197, 94); }
      100% { background-color: rgb(55, 65, 81); }
    }

    .success-border {
      border: 2px solid rgb(34, 197, 94) !important;
      transition: border-color 0.3s ease;
    }

    .btn-success-transition {
      background-color: rgb(34, 197, 94) !important;
      transition: background-color 0.3s ease;
    }
  `;

  useEffect(() => {
    // Add styles to document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = modalStyles;
    document.head.appendChild(styleSheet);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (appointment?.patient.id) {
      fetchNotes(appointment?.patient.id);
    }
  }, [show]);

  const fetchNotes = async (id) => {
    try {
      setLoading(true);
      const userString = localStorage.getItem("userToken");
      const response = await axios.get(
        `http://localhost:5000/user/getMatchingNotes`,
        {
          params: {
            doctorId: userString,
            patientId: id,
          },
        }
      ); // Decrypt each note before setting to state
      const decryptedNotes = response.data.notes.map((note) => ({
        ...note,
        note: decrypt(note.note), // Decrypt the note content
      }));

      setNotes(decryptedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
      submitBtn.disabled = true;
      submitBtn.classList.add("btn-success-transition");

      // New formatting logic
      const formattedNote = newNote
        .split("\n") // First split by newlines to preserve manual line breaks
        .map((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("-")) {
            // If line starts with hyphen, format it
            return `- ${trimmedLine.substring(1).trim()}`;
          }
          // For lines without hyphen, just trim them
          return trimmedLine;
        })
        .filter((line) => line) // Remove empty lines
        .join("\n"); // Join back with newlines

      // Encrypt the formatted note before sending
      const encryptedNote = encrypt(formattedNote);

      const body = {
        note: encryptedNote,
        patient: appointment.patient.id,
        doctor: {
          _id: appointment.doctor.id,
          fullName: appointment.doctor.name,
          avatar: appointment.doctor.avatar,
        },
      };

      console.log("body is: ", body);
      await axios.post(`http://localhost:5000/user/addNotes`, body);

      setIsSuccess(true);
      setNewNote("");

      const notesList = document.querySelector(".notes-list");
      if (notesList) {
        notesList.classList.add("fade-in");
        setTimeout(() => notesList.classList.remove("fade-in"), 1000);
      }

      await fetchNotes(appointment?.patient.id);

      setTimeout(() => {
        submitBtn.innerHTML = "Add Note";
        submitBtn.disabled = false;
        submitBtn.classList.remove("btn-success-transition");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving note:", error);
      const submitBtn = document.getElementById("submitBtn");
      submitBtn.innerHTML = "Add Note";
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-success-transition");
      alert("Failed to save note");
    }
  };

  const toPakistanTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`modal ${show ? "d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-gray-800 text-white">
          <div className="modal-header border-gray-700">
            <h5 className="modal-title">
              Notes for {appointment?.patient?.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6>Add New Note</h6>
              <textarea
                className={`form-control bg-gray-700 text-white border-gray-600 mb-2 whitespace-pre-wrap ${
                  isSuccess ? "success-border" : ""
                }`}
                rows="3"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                style={{ whiteSpace: "pre-wrap" }}
              />
              <button
                id="submitBtn"
                className="btn btn-primary"
                onClick={handleSaveNote}
                disabled={!newNote.trim()}
              >
                Add Note
              </button>
            </div>
            <div>
              <h6>Previous Notes</h6>
              <div className="notes-list">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div
                      key={note._id}
                      className={`card bg-gray-700 mb-2 p-3 ${
                        index === notes.length - 1 && isSuccess
                          ? "highlight-new"
                          : ""
                      }`}
                    >
                      <p
                        className="mb-1 text-gray-300"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {note.note}
                      </p>
                      <small className="text-gray-400">
                        By: {toPakistanTime(note.date)}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No notes available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
