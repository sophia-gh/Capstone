import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { ComponentHealthBar } from '../layout/component_health_bar';


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
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [newDetailNumber, setNewDetailNumber] = useState("");
  const [newComponentNumber, setNewComponentNumber] = useState("");
  const [sortMode, setSortMode] = useState("status");
  const [filterMode, setFilterMode] = useState("all");

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

const handleAddComponent = async () => {
  try {
    const response = await fetch("/addComponent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool_number: toolNumber,
        detail_number: newDetailNumber,
        component_number: newComponentNumber,
      }),
    });
    const result = await response.json();
    if (result.message === "added component successfully") {
      alert("Component added!");
      setShowAddComponentModal(false);
    } else {
      alert("Error: " + JSON.stringify(result));
    }
  } catch (err) {
    console.error(err);
  }
};

const sortedFilteredComponents = React.useMemo(() => {
  let filtered = [...components];
  if (filterMode !== "all") {filtered = filtered.filter(c => c.current_state === filterMode)};
  if (sortMode === "status") {
    const order = { active: 1, inventory: 2, inactive: 3 };
    filtered.sort((a, b) => order[a.current_state] - order[b.current_state]);
  }
  if (sortMode === "hits_desc") {filtered.sort((a, b) => (b.current_hits ?? 0) - (a.current_hits ?? 0))};
  if (sortMode === "height_asc") {filtered.sort((a, b) => (a.current_height ?? 0) - (b.current_height ?? 0))};
  return filtered;
}, [components, sortMode, filterMode]);


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
        <li><strong>Company:</strong> {dieInfo?.company}</li>
        <li><strong>Punch Depth:</strong> {dieInfo?.punch_depth}</li>
        <li><strong>Material Thickness:</strong> {dieInfo?.material_thickness}</li>
      </ul>
    </div>
    <div className="card">
      <div className="production-header">
      <h2>Production Control</h2>    
      <div className="production">
        <button onClick={() => setShowModal(true)}>
          {isProducing ? "End Production" : "Start Production"}
        </button>
      </div> 
      </div>

      {/* Start Confirmation 'modal', I was lazy with this one at first bc i didn't want to fix the rendering issue, however the divs can just share the html vars now if we want */}
      {showModal && !isProducing && (
        <div>
          <div>
            <h3>Confirm Start</h3>
            <p>Start production for die <strong>{toolNumber}</strong>?</p>
            <div className="production">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleStartProduction}>Confirm</button>
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
        <div className="table-card-header">
          <h2>Components for {toolNumber}</h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
            <option value="all">All States</option>
            <option value="active">Active</option>
            <option value="inventory">Inventory</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="status">Sort: Active, Inventory, Inactive</option>
            <option value="hits_desc">Sort: Current Hits (High to Low)</option>
            <option value="height_asc">Sort: Current Height (Low to High)</option>
          </select>
          <button
            className="add-button"
            onClick={() => setShowAddComponentModal(true)}
          >
            + Add Component
          </button>
          </div>
        </div>
        {loadingComponents ? (
          <p>Loading components...</p>
        ) : components.length === 0 ? (
          <p>No components found for this die.</p>
        ) : (
          <div className="table-scroll">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Detail Number</th>
                <th>Min Height</th>
                <th>Nominal Height</th>
                <th>Low Quantity</th>
                <th>Sharpen Frequency</th>
                <th>Description</th>
                <th>Number Used</th>
                <th>Cost</th>
                <th>Current Revision</th>
                <th>Build #</th>
                <th>Component #</th>
                <th>Detail #</th>
                <th>Revision</th>
                <th>Current Height</th>
                <th>Current Hits</th>
                <th>Lifetime Hits</th>
                <th>Current State</th>
                <th>Component Height</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredComponents.map((comp, idx) => (
                <tr key={`${comp.tool_number}-${idx}`}>
                  <td>{detail?.detail_number}</td>
                  <td>{detail?.min_height}</td>
                  <td>{detail?.nominal_height}</td>
                  <td>{detail?.low_quantity}</td>
                  <td>{detail?.frequency_to_sharpen}</td>
                  <td>{detail?.description || "N/A"}</td>
                  <td>{detail?.number_used_in_tool}</td>
                  <td>{detail?.cost}</td>
                  <td>{detail?.current_revision}</td>
                  <td>{comp.build_number}</td>
                  <td>{comp.component_number}</td>
                  <td>{comp.detail_number}</td>
                  <td>{comp.revision ?? "-"}</td>
                  <td>{comp.current_height ?? "-"}</td>
                  <td>{comp.current_hits ?? 0}</td>
                  <td>{comp.lifetime_hits ?? 0}</td>
                  <td>{comp.current_state}</td>
                  <td><ComponentHealthBar component={comp}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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
      {showAddComponentModal &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Add Component</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label>Detail Number</label>
                <input
                  type="text"
                  value={newDetailNumber}
                  onChange={(e) => setNewDetailNumber(e.target.value)}
                />

                <label>Component Number</label>
                <input
                  type="text"
                  value={newComponentNumber}
                  onChange={(e) => setNewComponentNumber(e.target.value)}
                />

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Add button clicked");
                      handleAddComponent();
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setShowAddComponentModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.getElementById("modal-root")
        )
      }

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dies;