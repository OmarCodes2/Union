import React, { useState, useEffect } from "react";
import "../GamePage.css";

function GamePage() {
  // puzzle data from backend
  const [puzzle, setPuzzle] = useState(null);

  // dashes/slots for left and right words
  const [leftSlots, setLeftSlots] = useState([]);
  const [rightSlots, setRightSlots] = useState([]);

  const [currentIndexLeft, setCurrentIndexLeft] = useState(0);
  const [currentIndexRight, setCurrentIndexRight] = useState(0);

  // tracks which side is currently active/selected
  const [selectedSide, setSelectedSide] = useState(null);

  // track mistakes
  const [mistakes, setMistakes] = useState(6);

  // track any end-of-game message
  const [gameMessage, setGameMessage] = useState("");

  // ----------------------------------------------------------------
  // 1) Fetch puzzle on mount
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/getPuzzle");
        const data = await response.json();

        // Set puzzle data in state
        setPuzzle(data);

        // Based on puzzle.firstWord/secondWord, create empty slots
        if (data?.firstWord) {
          setLeftSlots(Array(data.firstWord.length).fill(""));
        }
        if (data?.secondWord) {
          setRightSlots(Array(data.secondWord.length).fill(""));
        }
      } catch (error) {
        console.error("Error fetching puzzle:", error);
      }
    };

    fetchPuzzle();
  }, []);

  // ----------------------------------------------------------------
  // 2) Handle keyboard input
  // ----------------------------------------------------------------
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
  }, [
    selectedSide,
    leftSlots,
    rightSlots,
    currentIndexLeft,
    currentIndexRight,
  ]);

  // ----------------------------------------------------------------
  // 3) Check if all slots are filled
  // ----------------------------------------------------------------
  const isSubmitEnabled =
    leftSlots.length > 0 &&
    rightSlots.length > 0 &&
    leftSlots.every((slot) => slot !== "") &&
    rightSlots.every((slot) => slot !== "");

  // ----------------------------------------------------------------
  // 4) Handle submit (win/loss logic)
  // ----------------------------------------------------------------
  const handleSubmit = () => {
    // if there's no puzzle yet, do nothing
    if (!puzzle) return;

    // Join typed letters
    const typedLeft = leftSlots.join("").toLowerCase();
    const typedRight = rightSlots.join("").toLowerCase();

    // Compare with puzzle's firstWord/secondWord
    const actualLeft = puzzle.firstWord.toLowerCase();
    const actualRight = puzzle.secondWord.toLowerCase();

    if (typedLeft === actualLeft && typedRight === actualRight) {
      setGameMessage("You win!");
    } else {
      const newMistakes = mistakes - 1;
      setMistakes(newMistakes);
      // if out of lives
      if (newMistakes <= 0) {
        setGameMessage("Game Over!");
      }
    }

    // Clear typed words (or keep them, up to you)
    setLeftSlots(Array(puzzle.firstWord.length).fill(""));
    setRightSlots(Array(puzzle.secondWord.length).fill(""));
    setCurrentIndexLeft(0);
    setCurrentIndexRight(0);
    setSelectedSide(null);
  };

  // ----------------------------------------------------------------
  // 5) Render
  // ----------------------------------------------------------------
  return (
    <div className="game-page">
      {/* Dashes Row */}
      <div className="dashes-row">
        <div
          className={`dashes-column ${
            selectedSide === "left" ? "active-column" : ""
          }`}
          onClick={() => setSelectedSide("left")}
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
          className={`dashes-column ${
            selectedSide === "right" ? "active-column" : ""
          }`}
          onClick={() => setSelectedSide("right")}
        >
          {rightSlots.map((letter, i) => {
            const isCurrent =
              selectedSide === "right" && i === currentIndexRight;
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
        {/* We only render grid items if puzzle is loaded */}
        {puzzle && (
          <>
            <div className="grid-item">{puzzle.firstColumn[0]}</div>
            <div className="grid-item">{puzzle.middleColumn[0]}</div>
            <div className="grid-item">{puzzle.rightColumn[0]}</div>

            <div className="grid-item">{puzzle.firstColumn[1]}</div>
            <div className="grid-item">{puzzle.middleColumn[1]}</div>
            <div className="grid-item">{puzzle.rightColumn[1]}</div>

            <div className="grid-item">{puzzle.firstColumn[2]}</div>
            <div className="grid-item">{puzzle.middleColumn[2]}</div>
            <div className="grid-item">{puzzle.rightColumn[2]}</div>
          </>
        )}
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
          {/* Display as many dots as mistakes left */}
          {[...Array(mistakes)].map((_, idx) => (
            <span className="dot" key={idx} />
          ))}
        </span>
      </div>

      {/* If there's a win/loss message, show it */}
      {gameMessage && <div className="game-message">{gameMessage}</div>}
    </div>
  );
}

export default GamePage;
