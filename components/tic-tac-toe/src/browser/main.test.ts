import { TicTacToe } from "./main";

describe("Tic Tac Toe game", () => {
  it("Should be completed with the right winner", () => {
    const [isComplete, winner] = TicTacToe.isComplete([
      1, -1, 1,
      0, 1, 0,
      1, 0, -1,
    ])
    expect(isComplete).toEqual(true);
    expect(winner).toEqual(1);
  })

  it("Should be completed with a draw", () => {
    const [isComplete, winner] = TicTacToe.isComplete([
      1, -1, -1,
      -1, 1, 1,
      1, 1, -1,
    ])
    expect(isComplete).toEqual(true);
    expect(winner).toEqual(0);
  })

  it("Should be not completed with no winner", () => {
    const [isComplete, winner] = TicTacToe.isComplete([
      1, -1, 1,
      0, 0, 0,
      1, 0, -1,
    ])
    expect(isComplete).toEqual(false);
    expect(winner).toEqual(0);
  })
})
