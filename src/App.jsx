import { useState } from 'react'
import './App.css'

function Square({ value, index, onSquareClick, locations }) {
 
  return (<button 
            className="square" 
            id={"square-" + index}
            value={value}
            row={locations[index][0]}
            col={locations[index][1]}
            onClick={() => onSquareClick(index)}>
              {value}
          </button>
         );
}

function Board({ squares, xIsNext, onPlay, locations }) {
  
  function makeBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(<Square 
                   value={squares[i]} 
                   index={i} 
                   onSquareClick={onPlay}
                   locations={locations}
                 />);
    }
    return board;
  }
  
    return (
      <div className="board">
        {makeBoard()}
      </div>
    );
  }

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  const xIsNext = history.length % 2 === 0 ? false : true;
  const [sort, setSort] = useState(false);
  const [locations, setLocations] = useState([[0, 0]]);
  
  const squareLocations = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      squareLocations.push([i, j])
    }
  }
  
  function handlePlay(index) {
    let nextSquares = currentSquares.slice();
    if (currentSquares[index] || winner) return;
    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    setLocations([...locations, squareLocations[index]]);
    setHistory([...history, nextSquares]);
  }
  
  function historyList() { 
    const list = history.map((move, i) => {
      let button;
      if (i === 0) {
        button = <span className="game-start-button">Go to game start</span>;
      } else {
        button = `Go to move #${i}`;
      }
      return (
        <li key={i}>
          <button onClick={() => handleJumpTo(i)}>{button}</button>
         {i !== 0 
            ? <p className="location">{` (${locations[i][0] + 1}, ${locations[i][1] + 1})`}</p>
            : ""
         }
        </li>
      );
    });
    return (sort ? list.toReversed() : list);
  }
  
  function handleJumpTo(move) {
    setHistory(history.slice(0, move + 1));
    setLocations(locations.slice(0, move + 1));
    winSquares.forEach(el => {
      const square = document.getElementById(`square-${el}`);
      square.style.backgroundColor = "var(--main-bg-color)";
      square.style.removeProperty("-webkit-text-stroke");
    });
  }
  
  function handleNewGame() {
    setHistory([history[0]]);
    setLocations([locations[0]]);
    winSquares.forEach(el => {
      const square = document.getElementById(`square-${el}`);
      square.style.removeProperty("background-color");
      square.style.removeProperty("-webkit-text-stroke");
    });
  }
  
  let status;
  const [winner, winSquares] = checkWinner(currentSquares);
  if (winner) {
    status = `Winner is ${winner}!!!`;
  } else if (history.length > 9) {
    status = "Tie!";
  } else {
    status = `Player's turn: ${xIsNext ? "X" : "O"}`;
  }
  
  let turn;
  if (history.length > 9 || winner) {
    turn = "Game Over";
  } else {
    turn = `You are on turn #${history.length}`;
  }
  
  return (
    <div className="game">
      <div className="status">{status}</div>
      <Board 
        squares={currentSquares}
        xIsNext={xIsNext}
        onPlay={handlePlay}
        locations={squareLocations}
      />
      <div className="list">
        <ul className="history-list">{historyList()}</ul>
        <button className="sort" onClick={() => setSort(!sort)}>
          {sort ? "Descending" : "Ascending"}
        </button>
      </div>
      <div className="footer">
        <p className="turn">{turn}</p>
        {(winner || history.length > 9) 
          ? <button className="new-game" onClick={handleNewGame}>New Game</button> 
          : ""}
      </div>
    </div>
  );
}

function checkWinner(squares) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let winner;
  let winSquares;
  winCombos.forEach(([a, b, c]) => {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      winner = squares[a];
      winSquares = [a, b, c];
    }
  });
  if (winner) {
    winSquares.forEach(el => {
      const square = document.getElementById(`square-${el}`);
      square.style.backgroundColor = "var(--highlight-color)";
      square.style.webkitTextStroke = "2px black";
    })
  }
  return [winner, winSquares];
}



function App() {
  return (
    <>
      <Game />
    </>
  );
}

export default App



// cause you can

// return (
//       <div>{(() => {
//         let data = [];
//         for (let i = 0; i < num; i++) {
//           data.push(
//             <div className="row">
//               <div>{(() => {
//                   let data = [];
//                   for (let i = 0; i < num; i++) {
//                     data.push(<div className="square" onClick={() => console.log('yo')}></div>);
//                   }
//                   return data;
//                 })()}</div>
//             </div>
//            );
//         }
//         return data;
//       })()}</div>
//     )
