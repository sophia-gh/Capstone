import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dies, setDies] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const diesRes = await fetch("/getAllDies");
        const diesData = await diesRes.json();

        const compRes = await fetch("/getAllComponentsForAllDies");
        const allComponents = await compRes.json();

        setDies(diesData);
        setComponents(allComponents);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalDies = dies.length;
  const totalComponents = components.length;
  const activeComponents = components.filter(c => c.current_state === "active").length;
  const diesProducing = dies.filter(d => d.status === "in_production").length;
  const lowHeightComponents = components.filter(
    c => c.current_height !== null && c.current_height <= (c.nominal_height ?? 0) * 0.8
  );
  const highHitComponents = components.filter(
    c => (c.current_hits ?? 0) > 50000
  );

  return (
    <div>
      <header>
        <h1 className="main-header">Dashboard</h1>
        <p>
          Overview of tool and die operations/activity, key metrics, and operational status.
        </p>
      </header>
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
      <section className="card-grid">
        <div className="card" onClick={() => navigate("/Tooling")} style={{ cursor: "pointer" }}>
          <div className="card-header">
            <h3>Total Dies</h3>
          </div>
          <p className="card-value">{totalDies}</p> 
          <span className="card-subtext">{diesProducing} in production</span>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Total Components</h3>
          </div>
          <p className="card-value">{totalComponents}</p>
          <span className="card-subtext">{activeComponents} currently active</span>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Needs Attention</h3>
          </div>
          <p className="card-value">{lowHeightComponents.length}</p>
          <span className="card-subtext">{highHitComponents.length} high-wear components</span>
        </div>

        <div className="card">
          <div className="card-header"><h3>Serviced Dies</h3></div>
          <p className="card-value">
            {dies.filter(d => d.status === "serviced").length}
          </p>
          <span className="card-subtext">Ready for setup</span>
        </div>
      </section>

      <main>
        <p>Data Highlights</p>
        <div className="card">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Active Components</td>
                  <td>{activeComponents}</td>
                  <td>Stable</td>
                </tr>
                <tr>
                  <td>Dies in Production</td>
                  <td>{diesProducing}</td>
                  <td>{diesProducing > 0 ? "Running" : "Idle"}</td>
                </tr>
                <tr>
                  <td>Low-Height Components</td>
                  <td>{lowHeightComponents.length}</td>
                  <td>{lowHeightComponents.length > 0 ? "Warning" : "OK"}</td>
                </tr>
                <tr>
                  <td>High-Hit Components</td>
                  <td>{highHitComponents.length}</td>
                  <td>{highHitComponents.length > 0 ? "Review" : "OK"}</td>
                </tr>
              </tbody>
            </table>
            </div>
      </main> 
      </>
      )}
    </div>
  );
}

export default Dashboard;