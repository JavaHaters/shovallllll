import "../App.css";
import React from "react";
import Cell from "./cell.js";
import {
  NOT_REVEALED_CELL,
  EMPTY_CELL,
  MINE_CELL,
  FLAG_CELL
} from "../common/constants.js";

export class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = { board: this.generateBoard() };
  }

  generateMinePositions() {
    const { height, width, mines } = this.props;

    var randomNumbersForMines = [];
    var board = Array(height);

    for (let i = 0; i < board.length; i++) {
      var row = new Array(width);

      for (let j = 0; j < width; j++) {
        row[j] = {
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
          //console.log(i * height + j, i, j);
          //console.log(board[i][j]);

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
    // TODO: THIS IS BAD
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
    var board = this.generateMinePositions();
    this.generateNeighborsCounting(board);

    return board;
  }

  render() {
    return this.renderBoard(this.state.board);
  }

  getValue(currentCell) {
    if (!currentCell.isRevealed) {
      return currentCell.value.isFlagged === true
        ? FLAG_CELL
        : NOT_REVEALED_CELL;
    }

    if (currentCell.isMine === true) {
      return MINE_CELL;
    }

    if (currentCell.neighbours === 0) {
      return EMPTY_CELL;
    }

    return currentCell.neighbours;
  }

  reveal(dataitem) {
    dataitem.isRevealed = true;
    var emoji = this.getValue(dataitem);
    dataitem.emoji = emoji;
    var boarddd = this.state.board;
    boarddd[dataitem.x][dataitem.y] = dataitem;

    this.setState({
      board: boarddd
    });
  }

  flagCell(dataitem) {
    dataitem.isFlagged = true;
    var emoji = this.getValue(dataitem);
    dataitem.emoji = emoji;
    var boarddd = this.state.board;
    boarddd[dataitem.x][dataitem.y] = dataitem;

    this.setState({
      board: boarddd
    });
  }

  renderBoard(data) {
    return data.map((datarow) => {
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
  }
}

export default Board;
