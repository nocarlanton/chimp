import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import wordList from './fiveletterwords.json';

const LetterState = {
  FOUND: 'found',
  DEAD: 'dead',
  OPEN: 'open'
}

function Square(props) {
  var color;
  if (props.letterState === LetterState.OPEN) {
    color = "letter-open";
  } else if (props.letterState === LetterState.FOUND) {
    color = "letter-found";
  } else {
    color = "letter-dead";
  }
  return (
    <button className={color} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


/*
function InputBox(props) {
  return (
  <div>
      <input type="text" name='GuessBox'></input>
      <input type="submit" value="Submit"></input>
      </div>
  )
}
 */
class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      letterState={this.props.letterState[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  renderSquares() {
    var temp = []
    for (var i = 0; i < 26; i++) {
      temp.push(this.renderSquare(i))
    }
    return temp;
  }

  render() {
    return (
      <div id="daddy" className="board-row">
        {this.renderSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleGuess = this.handleGuess.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      guesses: [],
      letterState: Array(26).fill(LetterState.OPEN),
      squares: Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i)),
      goodLetter: [],
      badLetter: [],
      stepNumber: 0,
      secret: "magic",
      gameOver: false
    };

  }

  calculateWinner(current) {
     /*if (this.state.secret === current.guesses) {
     let status;
      status = "Winner: ";// + this.winner;
      return true;
    } else {
      status = "Current Known letters"; // + letters.splice()
      */return false;

  }

  updateLists() {
    var good = this.state.goodLetter.slice();
    var bad = this.state.badLetter.slice();
    var btemp = [];
    var gtemp = [];
    for (var i = 0; i < good.length; i++) {
      gtemp.push(good[i]);
    }
    for (var j = 0; j < bad.length; j++) {
      btemp.push(bad[j]);
    }
    return (
      <div>
        <p>Found letters:{gtemp}</p>
        <p>Dead letters: {btemp}</p>
      </div>
    );
  }

  InputBox() {
    console.log("entered input box");
    return (
      <div>
        Guess a 5 Letter Word: <input type="text" value={this.state.currentGuess} onChange={this.updateInputValue} onKeyDown={this.handleKeyDown} />
      </div>
    )
  }

  handleKeyDown(e) {
    console.log('do validate of ' + e.key);
    if (e.key === 'Enter') {
      console.log('Entered, validate ' + this.state.currentGuess);
      this.handleGuess();
    }
    else {
      // if (this.state.showWarning) {
      //     this.setState({
      //         showWarning: false
      //     })
      // }
    }
  }

  updateInputValue(evt) {
    console.log('uiv: ' + evt.target.value);

    var currentGuess = evt.target.value;
    this.setState({
      currentGuess: currentGuess
    });
  }


  handleGuess() {
    // check length of string, check dictionary for correctness
    // 
    var currentGuess = this.state.currentGuess;
    if(!wordList[currentGuess]){
      //TODO: error msg
      return;
    }
    if(currentGuess === this.state.secret){
      console.log("winner");
      this.setState({
        gameOver : true
      });
      return;
    }
    //find count of letters
    var count = 0;
    for(let x of currentGuess){
      console.log('current char: ' + x);
      if(this.state.secret.indexOf(x) >= 0){
        count++;
      }
    }
    var guesses = this.state.guesses.slice();
    console.log("count: " + count);
    this.setState({
      guesses: guesses.concat([{
        guess: currentGuess,
        count: count
      }]),
      currentGuess: "",
    });

  }

  handleClick(i) {
    var ls = this.state.letterState.slice();
    if (ls[i] === LetterState.OPEN) {
      ls[i] = LetterState.FOUND;
    } else if (ls[i] === LetterState.FOUND) {
      ls[i] = LetterState.DEAD;
    } else {
      ls[i] = LetterState.OPEN;
    }
    var bad = [];
    var good = [];
    for (var j = 0; j < 26; j++) {
      if (ls[j] === LetterState.FOUND)
        good.push(String.fromCharCode(65 + j))
      else if (ls[j] === LetterState.DEAD) {
        bad.push(String.fromCharCode(65 + j))
      }
    }
    this.setState({
      letterState: ls,
      goodLetter: good,
      badLetter: bad
    });
  }


  render() {
    const guesses = this.state.guesses;
    const guessesjsx = guesses.map((guess) =>
      <li key={guess.guess}><b>{guess.guess}</b> {guess.count}</li>
    );
    //const history = this.state.history;
    //const current = history[this.state.stepNumber];
    //const winner = this.calculateWinner(current.guesses);
    //const letters =  //check array of letters for green squares
    /* const moves = history.map((step, move) => {
       const desc = move ?
         'Go to move #' + move :
         'Go to game start';*/
    /*  return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );*/
    const guessHandler = this.state.gameOver ? <div> WINNER! word: {this.state.currentGuess} </div> :
      (<div>
        {this.InputBox()}
      </div>);
    /* var ib = <form id='guessBox' onSubmit={this.handleGuess}>
       Guess a 5 Letter Word: <input type="text" name='GuessBox'></input>
       <input type="submit" value="Submit"></input>
     </form>;*/
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            letterState={this.state.letterState}
            onClick={(i) => this.handleClick(i)}
          />

          <div className="game-info">
          <div>{guessHandler}</div>
          <div>
              <ul> {this.updateLists()} </ul>
            </div>
            <div>
              <ul>{guessesjsx}</ul>
            </div>
            
          </div>

        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
