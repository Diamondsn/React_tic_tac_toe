import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     constructor(){
//           super();
//           this.state={
//               value:null,
//           };
//     }

//     render() {
//       return (
//         <button className='square' onClick={()=>this.props.handleClick}>{this.props.value}
//         </button>
//       );
//     }
//   }
function calculatateWinner(squares) {
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
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a],line:[a,b,c]};
    }
  }
  return {winner:null,line:[]};
}


function Square(props) {
  if(props.highlight)
  {
     return (
    <button className='square' onClick={props.onClick} style={{color:'red'}}>{props.value}</button>
  );
}
else{
  return (
    <button className='square' onClick={props.onClick}>{props.value}</button>
  );
}
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square key={i} value={this.props.squares[i]} highlight={this.props.winnerline.includes(i)} onClick={() => this.props.onClick(i)} />);
  }

  render() {
        var rows=[];
        for(var i=0;i<3;++i)
        {
          var row=[];
          for(var j=0;j<3;j++)
          {
              row.push(this.renderSquare(3*i+j));    
          }
          rows.push(<div className="board-row">{row}</div>);
        }
       return(
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        { squares: Array(9).fill(null),lastStep:'Game Start' }
    ],
      stepNumber: 0,
      xIsNext: true,
      sort: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();//浅复制
    if (calculatateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = '(' + (i % 3 + 1) + ',' + (Math.floor(i / 3) + 1) + ')';
    const lastStep=squares[i]+'Moved to'+location;
    this.setState({
      history: history.concat([{ squares: squares ,lastStep:lastStep}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) ? false : true,
    });
  }

  handleSort() {
    this.setState({ 
      sort: !this.state.sort, 
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculatateWinner(current.squares).winner;
    const winnerline=calculatateWinner(current.squares).line;

    if (this.state.sort) {
      history = this.state.history.slice();
      history = history.reverse();
    }
    const moves = history.map((step, move) => {
      const desc = step.lastStep;

      if (move === this.state.stepNumber) {
        return (<li key={move}><button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button></li>);
      }
      else {
        return (
          <li key={move}><button onClick={() => this.jumpTo(move)}>{desc}</button></li>
        );
      }
    });

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winnerline={winnerline} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSort()}>sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
