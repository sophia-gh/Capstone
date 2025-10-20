import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <p>
          Overview of your tool and die operations, key metrics, and system status.
        </p>
      </header>
            <section className="card-grid">
        <div className="card" onClick={() => navigate("/app/Components")} style={{ cursor: "pointer" }}>
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
        <p>this is all just dummy data. no calls here. i can't figure out how to make the cards look like the figma mockup. why do these look weird and offputting</p>
      </main>
    </div>
  );
}

export default Dashboard;