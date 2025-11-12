import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";


const Dies = () => {
  const [dies, setDies] = useState([]);
  const [loadingDies, setLoadingDies] = useState(false);
  const { toolNumber } = useParams();
  const [components, setComponents] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loadingComponents, setLoadingComponents] = useState(true);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [isProducing, setIsProducing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hits, setHits] = useState("");

  // this is the dies fetch used in tooling, it's needed here to get die status for the header, lightweight enough that it doesn't matter
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

  // Start Production
  const handleStartProduction = async () => {
    try {
      const response = await fetch("/startProductionRun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_number: toolNumber }),
      });
      const result = await response.json();
      console.log("Start production result:", result);
      // debug lines
      if (result.message === "successfully started production run") {
        alert("Production started successfully!");
        setIsProducing(true);
      } else if (result.message === "already in production") {
        alert("This die is already in production.");
        setIsProducing(true);
      } else {
        alert("Failed to start production: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error(err);
      alert("Error starting production.");
    } finally {
      setShowModal(false);
    }
  };

  // End Production
  const handleEndProduction = async () => {
    try {
      const response = await fetch("/endProductionRun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_number: toolNumber,
          number_of_hits: parseInt(hits) || 0,
        }),
      });
      const result = await response.json();
      console.log("End production result:", result);
      // we can remove any and all alerts, this is just deving stuff, helped me see what was going on
      if (result.message === "production run ended successfully") {
        alert("Production ended successfully!");
        setIsProducing(false);
        setHits("");
      } else {
        alert("Failed to end production: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error(err);
      alert("Error ending production.");
    } finally {
      setShowModal(false);
    }
  };

  // Fetch components
  useEffect(() => {
    const fetchComponents = async () => {
      setLoadingComponents(true);
      setError(null);
      try {
        const response = await fetch("/getComponentsForDie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool_number: toolNumber }),
        });
        if (!response.ok) throw new Error("Failed to fetch components");
        const result = await response.json();
        setComponents(result);
      } catch (err) {
        console.error(err);
        setError("No components loaded");
      } finally {
        setLoadingComponents(false);
      }
    };

    fetchComponents();
  }, [toolNumber]);

  // Fetch operations
  useEffect(() => {
    const fetchOperations = async () => {
      setLoadingOperations(true);
      setError(null);
      try {
        const response = await fetch("/getOperationsForDie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool_number: toolNumber }),
        });
        if (!response.ok) throw new Error("Failed to fetch operations");
        const result = await response.json();
        setOperations(result);
      } catch (err) {
        console.error(err);
        setError("No operations loaded");
      } finally {
        setLoadingOperations(false);
      }
    };

    fetchOperations();
  }, [toolNumber]);

  // Fetch component details
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch("/getAllComponentDetailsForDie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool_number: toolNumber }),
        });
        if (!response.ok) throw new Error("Failed to fetch detail");
        const result = await response.json();
        const first = Array.isArray(result) && result.length > 0 ? result[0] : null;
        setDetail(first);
        console.log("Fetched detail result (raw array):", result);
        console.log("Using detail object:", first);

      } catch (err) {
        console.error(err);
        setDetail(null);
      }
    };

    fetchDetail();
}, [toolNumber]);

const dieInfo = dies.find(d => d.tool_number === toolNumber);


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div className="card-grid die-header-grid">
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", marginBottom: "1rem" }}>
  <h2 style={{ margin: 0 }}>Die Details for {toolNumber}</h2>
  {/* this thing was hinted at in sophia's drawing, idk I like it */} 
  <span
    style={{
      backgroundColor: dieInfo?.status === "serviced" ? "#d4edda" : "#f8d7da",
      color: dieInfo?.status === "serviced" ? "#155724" : "#721c24",
      border: "1px solid",
      borderColor: dieInfo?.status === "serviced" ? "#c3e6cb" : "#f5c6cb",
      borderRadius: "12px",
      padding: "0.35rem 0.9rem",
      fontWeight: "bold",
      fontSize: "0.9rem",
      whiteSpace: "nowrap"
    }}
  >
    {dieInfo?.status === "serviced"
      ? "Serviced"
      : dieInfo?.status === "in_production"
      ? "In Production"
      : "Not Serviced"}
  </span>
</div>

      <ul className="die-detail-list">
        <li><strong>Tool Number:</strong> {toolNumber}</li>
        <li><strong>Detail Number:</strong> {detail?.detail_number}</li>
        <li><strong>Min Height:</strong> {detail?.min_height}</li>
        <li><strong>Nominal Height:</strong> {detail?.nominal_height}</li>
        <li><strong>Low Quantity:</strong> {detail?.low_quantity}</li>
        <li><strong>Sharpen Frequency:</strong> {detail?.frequency_to_sharpen}</li>
        <li><strong>Description:</strong> {detail?.description || "N/A"}</li>
        <li><strong>Number Used:</strong> {detail?.number_used_in_tool}</li>
        <li><strong>Cost:</strong> {detail?.cost}</li>
        <li><strong>Current Revision:</strong> {detail?.current_revision}</li>
      </ul>
    </div>
    <div className="card">
      <h2>Production Control</h2>
      <button onClick={() => setShowModal(true)}>
        {isProducing ? "End Production" : "Start Production"}
      </button>

      {/* Start Confirmation 'modal', I was lazy with this one at first bc i didn't want to fix the rendering issue, however the divs can just share the html vars now if we want */}
      {showModal && !isProducing && (
        <div>
          <div>
            <h3>Confirm Start</h3>
            <p>Start production for die <strong>{toolNumber}</strong>?</p>
            <div>
              <button onClick={handleStartProduction}>Confirm</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EndProduction modal, this create portal thing is necessary for ensuring proper rendering of the popup, otherwise there's hell to pay */}
      {showModal && isProducing &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>End Production</h3>
              <p>Enter number of hits completed:</p>
              <input
                type="number"
                value={hits}
                onChange={(e) => setHits(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <div className="modal-actions">
                <button onClick={handleEndProduction}>Confirm</button>
                <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")
        )
      }

    </div>

  </div>
      {/* Components Table, you've seen this one, currently adding filtering to it */}
      <div className="table-card">
        <h2>Components for {toolNumber}</h2>
        {loadingComponents ? (
          <p>Loading components...</p>
        ) : components.length === 0 ? (
          <p>No components found for this die.</p>
        ) : (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Build #</th>
                <th>Component #</th>
                <th>Detail #</th>
                <th>Revision</th>
                <th>Current Height</th>
                <th>Current Hits</th>
                <th>Lifetime Hits</th>
                <th>Current State</th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp, idx) => (
                <tr key={`${comp.tool_number}-${idx}`}>
                  <td>{comp.build_number}</td>
                  <td>{comp.component_number}</td>
                  <td>{comp.detail_number}</td>
                  <td>{comp.revision ?? "-"}</td>
                  <td>{comp.current_height ?? "-"}</td>
                  <td>{comp.current_hits ?? 0}</td>
                  <td>{comp.lifetime_hits ?? 0}</td>
                  <td>{comp.current_state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Operations Log Table, none are populated on my db */}
      <div className="table-card">
        <h2>Operations Log for {toolNumber}</h2>
        {loadingOperations ? (
          <p>Loading operations...</p>
        ) : operations.length === 0 ? (
          <p>No operations found for this die.</p>
        ) : (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Operation #</th>
                <th>Description</th>
                <th>Operator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, idx) => (
                <tr key={`${op.id}-${idx}`}>
                  <td>{op.date}</td>
                  <td>{op.operation_number}</td>
                  <td>{op.description}</td>
                  <td>{op.operator}</td>
                  <td>{op.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dies;