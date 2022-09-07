import React, { Component, useState } from "react";
import Board from "./Board"



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null) //Start with a blank array of 9 values that can be added to to update the game history
      }],
      stepNumber: 0,
      xIsNext: true //start with x as player
    };
  }
  jumpTo(step){ //essentially sends us back to step n and determines who was going at that time
    this.setState({
        stepNumber: step,
        xIsNext: (step%2) === 0,
    });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //exclusive second parameter means that we need to add 1 to capture the whole thing

    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([ //every time you click you add another boardState to our history
        {
          squares: squares
        }
      ]),
      stepNumber: history.length, 
      xIsNext: !this.state.xIsNext //flips back and forth
    });
   
  }

  render() {
    const history = this.state.history; //array of boardStates
    const current = history[this.state.stepNumber]; //access current boardState via index
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start'; //javascript makes it so that 0 would be a false value so that's why this runs first (0 is a falsy number)
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button> 
        </li>//returns a button for every recorded boardState in our array
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares} //since the displayed squares is contingent on state.stepNumber and jumpTo changes stepNumber, this is why
                                      //our time travel works
            onClick={i => this.handleClick(i)}
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

function calculateWinner(squares) { //takes in a boardState as a param
    const lines = [
      [0, 1, 2], //these are all possible ways to win in tic tac toe
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]; //takes each 3 'winning' values in lines
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        //if squares[0] is not null and squares[0] is also the same char ("X" or "O") to squares[1] and squares[2], give back a value
        return squares[a]; //don't need to send back X or O because the winner is whoever just went
      }
    }
    return null;
  }

export default Game