import { GameDisplay } from "./game-display";
import { TurnIndicator } from "./turn-indicator";
import { GameResult, WinnerBoard } from "./winner-board";

declare global {
  interface Window {
    ticTacToe: TicTacToe;
    turnIndicator: TurnIndicator;
  }
}

const TYPES: { [x: string]: string } = {
  "1": "×",
  "-1": "◯"
}

type TurnType = 1 | -1 | 0;
export class TicTacToe {
  private type: TurnType = 1;
  private state: TurnType[] = [];
  constructor(
    private indicator: TurnIndicator,
    private display: GameDisplay,
    private picker: HTMLElement,
    private winnerBoard: WinnerBoard
  ) {
    this.display.hide();
  }
  start(type: TurnType) {
    this.indicator.setTurn(0);
    this.indicator.show();
    this.type = type;
    this.display.show();
    this.picker.style.display = 'none';
    this.winnerBoard.hide();
    this.state = new Array(9).fill(0);
    this.display.reset()
  }
  restart() {
    this.picker.style.display = "block";
    this.display.hide();
    this.indicator.hide();
  }
  nextMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const indexAttr = target.getAttribute('index');
    if (!target || indexAttr === null) {
      return;
    }
    const index = parseInt(indexAttr);
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
    this.display.pause();
    this.indicator.setTurn(1);
    // Wait for the computer to decide
    setTimeout(async () => {
      const result = await fetch("/webcm/tic-tac-toe/next-move", {
        method: "POST",
        body: JSON.stringify({ state: this.state }),
      });
      const payload = await result.json();
      const computerNextMove = payload.index as TurnType;
      this.state[computerNextMove] = this.type * -1 as TurnType;
      this.display.markPosition(computerNextMove, TYPES[this.type * -1]);

      // Re-enable clicking for the first player
      this.display.resume();
      this.indicator.setTurn(0);

      if (this.finishIfComplete()) {
        return;
      }
    }, 1000)
  }
  finishIfComplete() {
    // Check if the game is complete
    const [completed, winner] = TicTacToe.isComplete(this.state);
    if (!completed) {
      return false
    }
    this.winnerBoard.showWinner(
      winner === this.type ? GameResult.WINNER : (winner === 0 ? GameResult.DRAW : GameResult.LOSER)
    );
    return completed
  }
  static isComplete(state: TurnType[]): [boolean, TurnType] {
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
    for (const line of indexes) {
      const sum = line.reduce((result, e) => result + state[e], 0);
      if (Math.abs(sum) === 3) {
        return [true, sum > 0 ? 1 : -1]
      }
    }
    // Is it a draw or just unfinished game?
    const isDraw = state.every((value) => value !== 0)
    return [isDraw, 0];
  }
}


// Check if we are running from the browser
if (typeof window === 'object') {
  window.onload = function () {
    const gameDisplay: HTMLElement | null = document.querySelector("#game-display")
    const gamePicker: HTMLElement | null = document.querySelector("#game-picker")
    const winnerBoard: HTMLElement | null = document.querySelector("#winner-board")

    const turnIndicatorElement: HTMLElement | null = document.querySelector('#turn-indicator');

    if (gameDisplay === null || gamePicker === null || winnerBoard === null || turnIndicatorElement === null) {
      alert("The game could load correctly. Please refresh.");
      return;
    }

    window.ticTacToe = new TicTacToe(
      new TurnIndicator(turnIndicatorElement),
      new GameDisplay(gameDisplay),
      gamePicker,
      new WinnerBoard(winnerBoard),
    );
  }
}
