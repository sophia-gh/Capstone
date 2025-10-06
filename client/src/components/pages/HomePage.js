import React, { useState, useEffect } from 'react';
import logo from '../../assets/Superb_logo.png'

const HomePage = () => {
  return (
    <div>
      <h1>Simple React Home Page</h1>
      <main>
        <img src={logo} alt="superb-logo"></img>
        <p>content</p>
      </main>
    </div>
  );
}

export default HomePage;