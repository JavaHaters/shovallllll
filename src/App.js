import "./App.css";
import React from "react";
import Game from "../src/components/game.js";

function App() {
  return (
    <div>
      <div className="App">
        <div className="Header">MY MINES</div>
        <Game></Game>
      </div>
    </div>
  );
}

export default App;
