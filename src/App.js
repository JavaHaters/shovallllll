import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Game from "../src/components/game.js";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Game></Game>
    </div>
  );
}

export default App;
