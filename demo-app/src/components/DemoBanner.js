import React from 'react';
import './DemoBanner.css';

const DemoBanner = () => {
  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <span className="demo-icon">🎭</span>
        <span className="demo-text">
          <strong>DEMO MODE</strong> - This is a demonstration version with mock data. No actual Reddit posts will be made.
        </span>
      </div>
    </div>
  );
};

export default DemoBanner;
