import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Tooling = () => {
  const [dies, setDies] = useState([]);
  const [loadingDies, setLoadingDies] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState("all");
  const [sortMode, setSortMode] = useState("tool_number");
  const [companyFilter, setCompanyFilter] = useState("all");

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

const filteredDies = dies.filter((die) => {
    const statusMatch = filterMode === "all" ? true : die.status === filterMode;
    const companyMatch = companyFilter === "all" ? true : die.company === companyFilter;
    return statusMatch && companyMatch;
});

const sortedFilteredDies = [...filteredDies].sort((a, b) => {
    if (sortMode === "tool_number") return a.tool_number.localeCompare(b.tool_number);
    if (sortMode === "company") return a.company.localeCompare(b.company);
    if (sortMode === "status") return a.status.localeCompare(b.status);
    return 0;
});


  return (
<div className="tooling-page"  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <div style= {{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="main-header">Select Die </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
            <select className="filter" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                <option value="all">Companies</option>
                <option value="Superb">Superb</option>
                <option value="Eaton">Eaton</option>
                <option value="Pontiac_Coil">Pontiac_Coil</option>
                <option value="Brose">Brose</option>
                <option value="Thermodisc">Thermodisc</option>
                <option value="Gentex">Gentex</option>
            </select>
            <select className="filter" value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
              <option value="all">Status</option>
              <option value="in_production">In Production</option>
              <option value="not_serviced">Not Serviced</option>
              <option value="serviced">Serviced</option>
            </select>
            <select className="filter" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
              <option value="tool_number">Sort: Tool Number</option>
              <option value="company">Sort: Company</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
        </div>
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
      {sortedFilteredDies.map((die) => (
        <tr key={die.tool_number}>
          <td>{die.tool_number}</td>
          <td>{die.company}</td>
          <td>{die.status}</td>
          <td>
            <button
              onClick={() => navigate(`/Dies/${die.tool_number}`)}
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
  );
};
export default Tooling;