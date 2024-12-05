import axios from "axios";
import React, { useState, useEffect } from "react";

const SummaryModal = ({ show, onHide, appointment }) => {
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    if (appointment?.patient.id) {
      fetchSummaries();
    }
  }, [show, appointment?.patient.id]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const link = `http://localhost:5000/user/getSummaries/${appointment.patient.id}/${appointment.doctor.id}`;
      console.log("link is: ", link);
      const response = await axios.get(link);
      console.log("Summaries response:", response.data);
      setSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setLoading(false);
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
              Medical Summaries for {appointment?.patient?.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading summaries...</p>
              </div>
            ) : summaries && summaries.length > 0 ? (
              <div className="summaries-container">
                {summaries.map((summary, index) => (
                  <div
                    key={summary._id || index}
                    className="card bg-gray-700 p-3 mb-3"
                  >
                    <div className="mb-3">
                      <p className="text-white" style={{ opacity: 0.9 }}>
                        {summary.summary}
                      </p>
                    </div>
                    <div className="text-gray-400 mt-2 d-flex justify-content-between">
                      <small>Created: {toPakistanTime(summary.date)}</small>
                      <small>
                        Last Updated: {toPakistanTime(summary.date)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p>No summaries available for this patient</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
