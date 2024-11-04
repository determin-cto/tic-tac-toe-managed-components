const TYPES = {
  "1": "×",
  "-1": "◯"
}

class TurnIndicator {
  node;
  constructor(node) {
    this.node = node;
  }

  setTurn(index) {
    const spans = this.node.querySelectorAll('span');
    spans[0].setAttribute('class', index === 0 ? 'active' : '')
    spans[1].setAttribute('class', index === 1 ? 'active' : '')
  }
}

class TicTacToe {
  type = null; // 1 if cross or -1 if circle
  state;
  constructor(indicator) {
    this.indicator = indicator
    this.board = document.querySelector('#board');
    this.display = document.querySelector('#game-display');
    this.picker = document.querySelector('#game-picker');
    this.winnerBoard = document.querySelector('#winner-board');
  }
  start(type) {
    this.type = type;
    this.board.style.display = 'block';
    this.picker.style.display = 'none';
    this.winnerBoard.classList.add("hidden")
    this.winnerBoard.style.display = "none";
    this.state = new Array(9).fill(0);
    this.board.querySelectorAll('.board-col[index]').forEach(element => {
      element.innerHTML = ""
    })
  }
  restart() {
    this.picker.style.display = "block";
    this.board.style.display = "none";
  }
  nextMove(event) {
    const target = event.target;
    if (!target || target.getAttribute('index') === null) {
      return;
    }
    const index = parseInt(event.target.getAttribute('index'));
    if (this.state[index] !== 0) {
      alert("Position already taken");
      return;
    }
    target.innerHTML = TYPES[this.type]
    this.state[index] = this.type;

    if (this.finishIfComplete()) {
      return;
    }

    // Disable clicking for the first player
    this.display.style.pointerEvents = 'none';
    this.indicator.setTurn(1);
    // Wait for the computer to decide
    setTimeout(async () => {
      const result = await fetch("/webcm/tic-tac-toe/next-move", {
        method: "POST",
        body: JSON.stringify({ state: this.state }),
      });
      const payload = await result.json();
      const computerNextMove = payload.index;
      this.state[computerNextMove] = this.type * -1;
      document.querySelector("[index='" + computerNextMove + "']").innerHTML = TYPES[this.type * -1];

      // Re-enable clicking for the first player
      this.display.style.pointerEvents = 'all';
      this.indicator.setTurn(0);

      if (this.finishIfComplete()) {
        return;
      }
    }, 1000)
  }
  finishIfComplete() {
    // Check if the game is complete
    const [completed, winner] = this.isComplete();
    if (!completed) {
      return false
    }
    let phrase = "";
    switch (winner) {
      case this.type:
        phrase = "You are the winner!"
        break;
      case 0:
        phrase = "Draw!"
        break;
      default:
        phrase = "You lost :("
    }
    this.winnerBoard.querySelector("#winner-announcement").innerHTML = phrase;
    this.winnerBoard.style.display = "";
    this.winnerBoard.classList.remove("hidden")
    return completed
  }
  isComplete() {
    const indexes = [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of indexes) {
      let sum = line.reduce((result, e) => result + this.state[e], 0);
      if (Math.abs(sum) === 3) {
        console.log("Is complete", sum, line, this.state)
        return [true, sum > 0 ? 1 : -1]
      }
    }
    // Is it a draw?
    const isDraw = this.state.every((value) => value !== 0)
    return [isDraw, 0];
  }
}

window.onload = function () {
  window.turnIndicator = new TurnIndicator(document.querySelector('#turn-indicator'));
  window.ticTacToe = new TicTacToe(window.turnIndicator);
  window.turnIndicator.setTurn(0)
}
