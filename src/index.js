import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// square function
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// board class / component is a parent to square,
// made up of nine squares initially set to null values
class Board extends React.Component {

  // returns a square component with value of i
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }

  // required render function returns JSX of the 9 squares
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// game class / component has a board as a child
class Game extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coords: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  // handleClick function
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coords = getSquareCoords(i);

    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat(
        [
          {
            squares: squares,
            coords: coords,
          }
        ]
      ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // jumpTo method sets the state of the game to the requested step
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  // required render function that returns JSX of the board component
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + ' at coords ' + history[move].coords : 
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// render the game component to the screen at the root element
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// function that takes a sqaures object and returns the winner if there is one
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getSquareCoords(i) {
  switch(i) {
    case 0:
      return [0, 0];
    case 1:
      return [1, 0];
    case 2:
      return [2, 0];
    case 3:
      return [0, 1];
    case 4:
      return [1, 1];
    case 5:
      return [2, 1];
    case 6:
      return [0, 2];
    case 7:
      return [1, 2];
    case 8:
      return [2, 2];
    default:
      break;
  }
}