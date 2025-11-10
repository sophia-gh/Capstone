import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <div>
      <header>
        <h1 className="main-header">Dashboard</h1>
        <p>
          Overview of your tool and die operations, key metrics, and system status.
        </p>
      </header>
      <section className="card-grid">
        <div className="card" onClick={() => navigate("/app/Tooling")} style={{ cursor: "pointer" }}>
          <div className="card-header">
            <h3>Total Components</h3>
            
          </div>
          <p className="card-value">40</p> 
          <span className="card-subtext">+2 from last month</span>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Active Components</h3>
            
          </div>
          <p className="card-value">28</p>
          <span className="card-subtext">70% operational</span>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Needs Attention</h3>
          </div>
          <p className="card-value">8</p>
          <span className="card-subtext">3 high priority</span>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Total Hits This Month</h3>
          </div>
          <p className="card-value">53K</p>
          <span className="card-subtext">+6% from last month</span>
        </div>
      </section>
      <main>
        <p>Recent Activity</p>
        <div className="card">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10:45 AM</td>
                  <td>Component check completed</td>
                  <td>Success</td>
                </tr>
                <tr>
                  <td>9:30 AM</td>
                  <td>Tool #12 maintenance</td>
                  <td>Warning</td>
                </tr>
                <tr>
                  <td>8:00 AM</td>
                  <td>System reboot</td>
                  <td>Success</td>
                </tr>
              </tbody>
            </table>
            </div>
      </main>
    </div>
  );
}

export default Dashboard;