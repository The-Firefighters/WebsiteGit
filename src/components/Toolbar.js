import React from 'react';
import { Link } from 'react-router-dom'
import './Toolbar.css'; 

function Toolbar() {
  return (
    <div className="toolbar">
      <div className="toolbar-title">
      <h1 style={{ color: 'white' }}>The FireFighter Problem</h1>
      </div>
      <div className="toolbar-buttons">
        <Link to="/home-screen" className="toolbar-button">Home</Link>
        <Link to="/AlgorithmsPage" className="toolbar-button">Run The Algorithms</Link>
        <Link to="/Information" className="toolbar-button">Information</Link>
        <Link to="/contact" className="toolbar-button">About Us</Link>
      </div>
    </div>
  );
}

export default Toolbar;