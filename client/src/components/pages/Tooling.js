import React, { useState, useEffect } from 'react';
import Button from '../layout/button.js';

const Tooling = () => {
  const [queryData, setQueryData] = useState([]);

  const fetchData = () => {  
      fetch("/getAllDies")
      .then (response => response.json())
      .then (data => {setQueryData(data)})
  }

  useEffect(() => {
  fetchData();
}, []);

  return (
    <div>
      <h1 className="main-header">Tooling</h1>
      <div className="main-content">
        <div className="table-card">
      {queryData.length > 0 ? (
        <table className="activity-table">
          <thead>
            <tr>
              {Object.keys(queryData[0]).map((key) => (
                <th key={key}>
                  {key}
                </th>

              ))}
            </tr>
          </thead>                
          <tbody>
            {queryData.map((die, index) => (
              <tr key={index} className="card">
                {Object.values(die).map((value, id) => (
                  <td key={id}>
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No dies loaded yet.</p>
      )}
      </div>
      </div>
    </div>
  );
}

export default Tooling;