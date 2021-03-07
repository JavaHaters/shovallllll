import "../App.css";
import Cell from "./cell.js";
import {
  NOT_REVEALED_CELL,
  EMPTY_CELL,
  MINE_CELL,
  FLAG_CELL
} from "../common/constants.js";
import styled from "styled-components";
import React, { useState } from "react";

function generateMinePositions(height, width, mines) {
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

function generateNeighborsCounting(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine) {
        board[i][j].neighbours = countNeighbours(board, i, j);
      }
    }
  }

  return board;
}

function countNeighbours(board, heightIndex, widthIndex) {
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

function generateBoard(height, width, mines) {
  var board = generateMinePositions(height, width, mines);

  return generateNeighborsCounting(board);
}

function getValue(currentCell) {
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

function revealCurrentItem(dataitem, board) {
  dataitem.isRevealed = true;
  var emoji = getValue(dataitem);
  dataitem.emoji = emoji;

  board[dataitem.x][dataitem.y] = dataitem;

  return board;
}

function reveal(dataitem, board) {
  revealCurrentItem(dataitem, board);

  if (dataitem.isRevealed && dataitem.isMine) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        revealCurrentItem(board[i][j], board);
      }
    }
  }

  if (dataitem.isRevealed && dataitem.neighbours === 0) {
    revealEmpty(dataitem, board);
  }

  return board;
}

function checkForWin(board) {
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

function revealEmpty(dataitem, board) {
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
        board = reveal(board[i][j], board);

        if (board[i][j].neighbours === 0) revealEmpty(board[i][j], board);
      }
    }
  }
}

function flagCell(dataitem, board) {
  dataitem.isFlagged = !dataitem.isFlagged;
  var emoji = getValue(dataitem);
  dataitem.emoji = emoji;

  board[dataitem.x][dataitem.y] = dataitem;

  return board;
}

export function Board(props) {
  var { height, width, mines } = props;

  const generatedBoard = generateBoard(height, width, mines);
  const [board, setBoard] = useState(generatedBoard);

  const revealItem = (dataitem, board) => {
    var updatedDataItem = JSON.parse(JSON.stringify(dataitem));
    var updatedBoard = JSON.parse(JSON.stringify(board));

    setBoard(reveal(updatedDataItem, updatedBoard));

    checkForWin(updatedBoard);
  };

  const flagCellItem = (dataitem, board) => {
    var updatedDataItem = JSON.parse(JSON.stringify(dataitem));
    var updatedBoard = JSON.parse(JSON.stringify(board));

    setBoard(flagCell(updatedDataItem, updatedBoard));
  };

  function GenerateBoardUI(props) {
    return props.board.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <span key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              value={dataitem}
              onClick={() => revealItem(dataitem, props.board)}
              onLeftClick={() => flagCellItem(dataitem, props.board)}
            />
            {datarow[datarow.length - 1] === dataitem ? <div /> : ""}
          </span>
        );
      });
    });
  }
  //this.newGame = this.newGame.bind(this);
  return (
    <div>
      <StyledButton
        onClick={() => setBoard(generateBoard(height, width, mines))}
      >
        NEW GAME
      </StyledButton>
      <br />
      <GenerateBoardUI board={board}></GenerateBoardUI>
    </div>
  );

  // onClick={setBoard(generateBoard(props))}
}

const StyledButton = styled.button`
  margin-bottom: 1em;
  text-align: left;
  background: #111111;
  color: #aaaaaa;
  padding: 0.5em;
  font-family: inherit;
  font-size: 1em;
`;

export default Board;
