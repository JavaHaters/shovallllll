import "../App.css";
import React from "react";
import Cell from "./cell.js";
import {
  NOT_REVEALED_CELL,
  EMPTY_CELL,
  MINE_CELL,
  FLAG_CELL
} from "../common/constants.js";
import styled from "styled-components";

export class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = { board: this.generateBoard() };
    this.newGame = this.newGame.bind(this);
  }

  generateMinePositions() {
    const { height, width, mines } = this.props;

    var randomNumbersForMines = [];
    var board = Array(height);

    for (let i = 0; i < board.length; i++) {
      var row = new Array(width);

      for (let j = 0; j < width; j++) {
        row[j] = {
          isRevealed: false,
          isFlagged: false,
          isMine: false,
          neighbours: null,
          x: i,
          y: j,
          emoji: NOT_REVEALED_CELL
        };
      }

      board[i] = row;
    }

    for (let i = 0; i < mines; i++) {
      const rand = Math.floor(Math.random() * (height * width));

      if (randomNumbersForMines.find((a) => a === rand) == null) {
        randomNumbersForMines[i] = rand;
      } else {
        // yes i know this is shit
        i--;
      }
    }

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (randomNumbersForMines.find((a) => a === i * height + j)) {
          board[i][j].isMine = true;
        }
      }
    }

    return board;
  }

  generateNeighborsCounting(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (!board[i][j].isMine) {
          board[i][j].neighbours = this.countNeighbours(board, i, j);
        }
      }
    }
  }

  countNeighbours(board, heightIndex, widthIndex) {
    var count = 0;

    for (let i = heightIndex - 1; i <= heightIndex + 1; i++) {
      for (let j = widthIndex - 1; j <= widthIndex + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < board.length &&
          j < board[0].length &&
          board[i][j].isMine
        ) {
          count++;
        }
      }
    }

    return count;
  }

  generateBoard() {
    console.log("llaa");
    var board = this.generateMinePositions();
    this.generateNeighborsCounting(board);

    return board;
  }

  getValue(currentCell) {
    if (!currentCell.isRevealed) {
      return currentCell.isFlagged ? FLAG_CELL : NOT_REVEALED_CELL;
    }

    if (currentCell.isMine === true) {
      return MINE_CELL;
    }

    if (currentCell.neighbours === 0) {
      return EMPTY_CELL;
    }

    return currentCell.neighbours;
  }

  revealItem(dataitem) {
    dataitem.isRevealed = true;
    var emoji = this.getValue(dataitem);
    dataitem.emoji = emoji;
    var updatedBoard = this.state.board;
    updatedBoard[dataitem.x][dataitem.y] = dataitem;

    return updatedBoard;
  }

  reveal(dataitem) {
    var updatedBoard = this.revealItem(dataitem);

    if (dataitem.isRevealed && dataitem.isMine) {
      for (let i = 0; i < updatedBoard.length; i++) {
        for (let j = 0; j < updatedBoard[0].length; j++) {
          updatedBoard = this.revealItem(updatedBoard[i][j]);
        }
      }
    }

    if (dataitem.isRevealed && dataitem.neighbours === 0) {
      this.revealEmpty(dataitem, this.state.board);
    }

    this.setState({
      board: updatedBoard
    });

    this.checkForWin();
  }

  checkForWin() {
    const board = this.state.board;
    var count = 0;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const current = board[i][j];

        if (
          (current.isRevealed && !current.isMine) ||
          (!current.isRevealed && current.isMine)
        )
          count++;
      }
    }

    if (count === board.length * board[0].length) alert("win!");
  }

  revealEmpty(dataitem, board) {
    const x = dataitem.x;
    const y = dataitem.y;

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < board.length &&
          j < board[0].length &&
          !board[i][j].isRevealed
        ) {
          this.reveal(board[i][j]);

          if (board[i][j].neighbours === 0)
            this.revealEmpty(board[i][j], board);
        }
      }
    }
  }

  flagCell(dataitem) {
    dataitem.isFlagged = !dataitem.isFlagged;
    var emoji = this.getValue(dataitem);
    dataitem.emoji = emoji;
    var updatedBoard = this.state.board;
    updatedBoard[dataitem.x][dataitem.y] = dataitem;

    this.setState({
      board: updatedBoard
    });
  }

  render() {
    const GenerateBoardUI = (props) => {
      return props.board.map((datarow) => {
        return datarow.map((dataitem) => {
          return (
            <span>
              <Cell
                key={dataitem.x * datarow.length + dataitem.y}
                value={dataitem}
                onClick={this.reveal.bind(this, dataitem)}
                onLeftClick={this.flagCell.bind(this, dataitem)}
              />
              {datarow[datarow.length - 1] === dataitem ? <div /> : ""}
            </span>
          );
        });
      });
    };

    const StyledButton = styled.button`
      margin-bottom: 1em;
      text-align: left;
      background: #111111;
      color: #aaaaaa;
      padding: 0.5em;
      font-family: inherit;
      font-size: 1em;
    `;

    return (
      <div>
        <StyledButton onClick={this.newGame}>NEW GAME</StyledButton>
        <br />
        <GenerateBoardUI board={this.state.board}></GenerateBoardUI>
      </div>
    );
  }

  newGame() {
    this.setState({
      board: this.generateBoard()
    });
  }
}

export default Board;
