import React from 'react';
import '../HomePage.css'

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="header">
        <div className="logo">Union</div>
        <div className="subtitle">Get 6 chances to guess the words.</div>
      </div>
      <button className="play-button">Play</button>
      <div className="footer">
        <p>January 4, 2025</p>
        <p>No. 1295</p>
      </div>
    </div>
  );
};

export default HomePage;
