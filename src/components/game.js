import "../App.css";
import React from "react";
import Board from "../components/board.js";
import styled from "styled-components";

export class Game extends React.Component {
  state = {
    height: 8,
    width: 8,
    mines: 10
  };

  render() {
    const { height, width, mines } = this.state;

    const StyledBoard = styled.div`
      margin: auto;
      text-align: center;
    `;

    return (
      <div className="game">
        <StyledBoard>
          <Board height={height} width={width} mines={mines} />
        </StyledBoard>
      </div>
    );
  }
}

export default Game;
