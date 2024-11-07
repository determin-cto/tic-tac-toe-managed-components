export enum GameResult {
  WINNER,
  LOSER,
  DRAW
}

export class WinnerBoard {
  announcementElement: HTMLElement
  constructor(private winnerBoard: HTMLElement) {
    const announcementElement = winnerBoard.querySelector<HTMLElement>('#winner-announcement')
    if (announcementElement === null) {
      throw new Error("#winner-announcement cannot be found.");
    }
    this.announcementElement = announcementElement;
  }
  showWinner(result: GameResult) {
    const announcement = {
      [GameResult.WINNER]: "You are the winner!",
      [GameResult.LOSER]: "You lost :(",
      [GameResult.DRAW]: "Draw!",
    }[result];
    this.announcementElement.innerHTML = announcement;
    this.winnerBoard.style.display = "";

    // Allow for animation to happen
    requestAnimationFrame(() => {
      this.winnerBoard.classList.remove("hidden")
    })
  }
  hide() {
    this.winnerBoard.classList.add("hidden");
    this.winnerBoard.style.display = "none";
  }
}
