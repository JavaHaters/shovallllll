import logo from "./logo.svg";
import "./App.css";
import React from "react";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Game></Game>
    </div>
  );
}

class Game extends React.Component {
  state = {
    height: 8,
    width: 8,
    mines: 10,
  };

  render() {
    const { height, width, mines } = this.state;

    return (
      <div className="game">
        <Board height={height} width={width} mines={mines} />
      </div>
    );
  }
}

class Board extends React.Component {
  generateMinePositions() {
    const { height, width, mines } = this.props;
    
    var randomNumbersForMines = [];
    var board = Array(height);

    for (let i = 0; i < board.length; i++) {
      var row = new Array(width);        
      
      for (let j = 0; j < width; j++) {
        row[j] = { isFlagged: false, isMine: false, neighbours: null };
      }

      board[i] = row;
    }
    
    for (let i = 0; i < mines; i++) {
      const rand = Math.floor((Math.random() * (height*width)));
      
      if (randomNumbersForMines.find(a => a === rand) == null) {
        randomNumbersForMines[i] = rand;         
      }
      else { // yes i know this is shit
        i--;
      }
    }
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (randomNumbersForMines.find(a => a === (i * height + j)))
        {
          console.log(i * height + j, i , j)
          console.log(board[i][j]);
                    
          board[i][j].isMine = true;
        }
      }
    }

    console.log(board)

    return board;
  }

  generateNeighborsCounting(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j].isMine == false) {
          board[i][j].neighbours = this.countNeighbours(board, i, j);
        }
      }      
    }
  }

  countNeighbours(board, heightIndex, widthIndex) {
    var count = 0;

    for (let i = heightIndex - 1; i < heightIndex + 1; i++) {
      for (let j = widthIndex - 1; j < widthIndex + 1; j++) {
        if (i < 0 || j < 0 ||
          i >= board.length || j >= board[0].length ||
          (i == 0 && j == 0)) {
            continue;
        } 

        if (board[i][j].isMine == true) {
          count++;
        }
      }      
    }
  }

  generateBoard() {
    var board = this.generateMinePositions();    
     this.generateNeighborsCounting(board);

     return board;
  }
  
  render() {
    var board = this.generateBoard();
    
    return this.renderBoard(board);
  }

  renderBoard(data) {

    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell value={dataitem} onClick={() => dataitem.isRevealed = true} />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
            <b/>
          </div>
        );
      });
    });
  }
}

class Cell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {emoji: "🗨️"}
  }

  getValue() {
    console.log(this.props.value);
    if (!this.props.isRevealed) {
      return this.props.value.isFlagged === true ? "🚩" : "🗨️";
    }

    if (this.props.value.isMine === true) {
      return "💣";
    }

    if (this.props.value.neighbour === 0) {
      return "🗨️";
    }
    
    return this.props.value.neighbour;
  }

  b() {
    this.props.isRevealed = true;

    var emoji = this.getValue();
    this.setState({emoji: emoji});
  }

  render() {
    const {value, onClick, cMenu} = this.props;    
    return (
      <div
        onClick={()=> this.b()}
        onContextMenu={this.props.cMenu}
      >
      {this.state.emoji}
      </div>
    );
  }
}

export default App;
