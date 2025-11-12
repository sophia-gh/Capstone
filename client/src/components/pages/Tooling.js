import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Tooling = () => {
  const [dies, setDies] = useState([]);
  const [loadingDies, setLoadingDies] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() =>  {  
      const fetchDies = async () => {
      setLoadingDies(true);
      setError(null);

      try {
        const response = await fetch("/getAllDies");
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        const result = await response.json();
        setDies(result);
      } catch (error) {
        console.error("Error fetching dies:", error.message);
        setError("Failed to load dies.");
      } finally {
        setLoadingDies(false);
      }
    };
fetchDies();
  }, []);

  return (
<div className="tooling-page" style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 1 }}>
        <h1 className="main-header">Select Die </h1>

        {loadingDies ? (
          <p>Loading dies...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="table-card">
  <table className="activity-table">
    <thead>
      <tr>
        <th>Tool Number</th>
        <th>Company</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {dies.map((die) => (
        <tr key={die.tool_number}>
          <td>{die.tool_number}</td>
          <td>{die.company}</td>
          <td>{die.status}</td>
          <td>
            <button
              onClick={() => navigate(`/app/Dies/${die.tool_number}`)}
              style={{
                color: "var(--color-text)",
                border: "solid var(--color-border)",
                backgroundColor: "var(--color-card)",
                boxShadow: "var(--shadow-card)",
                cursor: "pointer",
              }}
            >View</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </div>
      </div>
  );
};
export default Tooling;