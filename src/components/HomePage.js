import React from "react";
import "../HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      {/* Logo and title */}
      <div className="header">
        <img src="/logo.png" alt="Wordle Logo" className="wordle-logo" />
        <h1 className="wordle-title">Union</h1>
      </div>

      {/* Tagline */}
      <div className="tagline-container">
        <p className="tagline">Get 6 chances to guess</p>
        <p className="tagline">the 2 words in the Venn.</p>
      </div>
      

      {/* Button row for wider screens, or stacked on narrow screens */}
      <div className="button-group">
        <button className="btn play-btn">Play</button>
      </div>

      {/* Date, puzzle info, and editor */}
      <div className="puzzle-info">
        <p>January 4, 2025</p>
        <p>No. 1295</p>
        <p>Edited by Omar Bakr</p>
      </div>
    </div>
  );
}

export default HomePage;
