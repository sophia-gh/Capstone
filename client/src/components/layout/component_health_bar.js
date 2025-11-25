import React from 'react';
import './style.css'

function ComponentHealthBar({ component={current_height:3.11}, detail={min_height:2.5, nominal_height:4}}) {
    // stuff for component health bar
    // nominal height = max_height
    // component.current_height = current height
    // min_height = min height
    const die_height_percent = detail
      ? Math.max(
          0,
          Math.min(
            100,
            ((component.current_height - detail.min_height) /
              (detail.nominal_height - detail.min_height)) *
              100
          )
        )
      : 0;

    // Convert percent → hue (0 = red, 60 = yellow, 120 = green)
    const hue = die_height_percent * 1.2;
    const barColor = `hsl(${hue}, 100%, 50%)`;

    return (
        <div className="component-health-bar-container">
            <span className="left-text">{detail ? detail.min_height.toFixed(2) : 'N/A'}</span>
            <div className="component-health-bar">
                <div style={{ 
                    width: `${die_height_percent}%`,
                    height: "100%",
                    background: barColor,
                    transition: "width 0.5s ease-in-out"
                  }} ></div> 
                <div className="hover-text">{component ? component.current_height.toFixed(2) : 'N/A'}</div>
            </div>
            
            <span className="right-text">{detail ? detail.nominal_height.toFixed(2) : 'N/A'}</span>
        </div>
    )
}

export {ComponentHealthBar};