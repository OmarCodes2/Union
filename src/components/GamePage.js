import React, { useState, useEffect } from "react";
import "../GamePage.css";

function GamePage() {
  const [leftSlots, setLeftSlots] = useState(["", "", "", "", ""]);
  const [rightSlots, setRightSlots] = useState(["", "", "", "", ""]);

  const [currentIndexLeft, setCurrentIndexLeft] = useState(0);
  const [currentIndexRight, setCurrentIndexRight] = useState(0);

  const [selectedSide, setSelectedSide] = useState(null);

  const handleColumnClick = (side) => {
    setSelectedSide(side);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedSide) return;
      const key = e.key;

      if (selectedSide === "left") {
        const newSlots = [...leftSlots];
        if (/^[a-zA-Z]$/.test(key)) {
          if (currentIndexLeft < newSlots.length) {
            newSlots[currentIndexLeft] = key.toUpperCase();
            setLeftSlots(newSlots);
            setCurrentIndexLeft((prev) => prev + 1);
          }
        } else if (key === "Backspace") {
          if (currentIndexLeft > 0) {
            const prevIndex = currentIndexLeft - 1;
            newSlots[prevIndex] = "";
            setLeftSlots(newSlots);
            setCurrentIndexLeft(prevIndex);
          }
        }
      } else if (selectedSide === "right") {
        const newSlots = [...rightSlots];
        if (/^[a-zA-Z]$/.test(key)) {
          if (currentIndexRight < newSlots.length) {
            newSlots[currentIndexRight] = key.toUpperCase();
            setRightSlots(newSlots);
            setCurrentIndexRight((prev) => prev + 1);
          }
        } else if (key === "Backspace") {
          if (currentIndexRight > 0) {
            const prevIndex = currentIndexRight - 1;
            newSlots[prevIndex] = "";
            setRightSlots(newSlots);
            setCurrentIndexRight(prevIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSide, leftSlots, rightSlots, currentIndexLeft, currentIndexRight]);

  // Check if all slots in both columns are filled
  const isSubmitEnabled =
    leftSlots.every((slot) => slot !== "") && rightSlots.every((slot) => slot !== "");

  // Reset the game (clear all slots)
  const handleSubmit = () => {
    setLeftSlots(["", "", "", "", ""]);
    setRightSlots(["", "", "", "", ""]);
    setCurrentIndexLeft(0);
    setCurrentIndexRight(0);
    setSelectedSide(null);
  };

  return (
    <div className="game-page">
      {/*DASHES ROW */}
      <div className="dashes-row">
        <div
          className={`dashes-column ${selectedSide === "left" ? "active-column" : ""}`}
          onClick={() => handleColumnClick("left")}
        >
          {leftSlots.map((letter, i) => {
            const isCurrent = selectedSide === "left" && i === currentIndexLeft;
            return (
              <div
                key={i}
                className={
                  "letter-slot" +
                  (letter ? " filled" : "") +
                  (isCurrent ? " selected" : "")
                }
              >
                {letter ? letter : ""}
              </div>
            );
          })}
        </div>

        <div
          className={`dashes-column ${selectedSide === "right" ? "active-column" : ""}`}
          onClick={() => handleColumnClick("right")}
        >
          {rightSlots.map((letter, i) => {
            const isCurrent = selectedSide === "right" && i === currentIndexRight;
            return (
              <div
                key={i}
                className={
                  "letter-slot" +
                  (letter ? " filled" : "") +
                  (isCurrent ? " selected" : "")
                }
              >
                {letter ? letter : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3×3 GRID */}
      <div className="grid-container">
        <div className="grid-item">BLANKET</div>
        <div className="grid-item">BOOT</div>
        <div className="grid-item">BREEZE</div>
        <div className="grid-item">PICNIC</div>
        <div className="grid-item">UMBRELLA</div>
        <div className="grid-item">PIE</div>
        <div className="grid-item">BROAD</div>
        <div className="grid-item">GASP</div>
        <div className="grid-item">PUFF</div>
      </div>

      {/* Submit Button */}
      <button
        className={`play-btn ${isSubmitEnabled ? "" : "disabled"}`}
        onClick={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        Submit
      </button>

      {/* Mistakes remaining */}
      <div className="mistakes-remaining">
        Mistakes Remaining:
        <span className="dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
    </div>
  );
}

export default GamePage;
