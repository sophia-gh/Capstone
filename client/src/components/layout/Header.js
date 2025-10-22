import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/apiCallExample"> APICall </Link>
      </nav>
    </header>
  );
};

export default Header;

{/* header file is no longer used due to the organization of the page, this file is historic/can be deleted */}