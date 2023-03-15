import TetrisGame from "./TetrisGame.js";
import assert from "assert";

describe("TetrisGame.addTimer", () => {
  it("adds a timer to the game", () => {
    const game = new TetrisGame();
    const return2 = () => 2;
    game.addTimer(3, return2);
    assert.deepEqual(game.timers, [{ framesLeft: 3, activate: return2 }]);
  });
});

describe("TetrisGame.addCounter", () => {
  it("adds a counter to the game", () => {
    const game = new TetrisGame();
    const return2 = () => 2;
    game.addCounter("framesSinceButtonPressed");
    assert.deepEqual(game.counters, [
      { name: "framesSinceButtonPressed", framesPassed: 0 },
    ]);
  });
});

describe("TetrisGame.removeCounter", () => {
  it("removes a specified counter from the game", () => {
    const game = new TetrisGame();
    const return2 = () => 2;
    game.addCounter("framesSinceButtonPressed");
    game.removeCounter("framesSinceButtonPressed");
    assert.deepEqual(game.counters, []);
  });
});

describe("TetrisGame.updateCountersAndTimers", () => {
  it("updates all counters and timers", () => {
    const game = new TetrisGame();
    const return2 = () => 2;
    game.addCounter("framesSinceButtonPressed");
    game.addTimer(3, return2);
    game.updateCountersAndTimers();
    assert.deepEqual(game.counters, [
      { name: "framesSinceButtonPressed", framesPassed: 1 },
    ]);
    assert.equal(game.timers[0].framesLeft, 2);
  });

  it("activates expired timers", () => {
    const game = new TetrisGame();
    let value = 3;
    const return2 = () => (value = 5);
    game.addTimer(3, return2);
    game.updateCountersAndTimers();
    assert.equal(value, 3);
    game.updateCountersAndTimers();
    assert.equal(value, 3);
    game.updateCountersAndTimers();
    assert.equal(value, 5);
  });
});

describe("TetrisGame.getNewGrid", () => {
  it("returns a new grid based on game's gridLength and gridHeight", () => {
    const game = new TetrisGame();
    game.gridHeight = 3;
    game.gridWidth = 2;
    const expectedGrid = [
      [{ empty: true }, { empty: true }],
      [{ empty: true }, { empty: true }],
      [{ empty: true }, { empty: true }],
    ];
    const grid = game.getNewGrid();
    assert.deepEqual(grid, expectedGrid);
  });
});

describe("TetrisGame.getCurrentGridState", () => {
  it("returns the visual grid based on all of the other grids", () => {
    const game = new TetrisGame();
    game.gridHeight = 3;
    game.gridWidth = 2;
    game.previouslyPlacedCellsGrid = [
      [{ empty: true }, { empty: true }],
      [{ empty: true }, { empty: true }],
      [
        { empty: false, type: "COLORED" },
        { empty: false, type: "COLORED" },
      ],
    ];
    game.ghostPieceGrid = [
      [{ empty: false, type: "GHOST" }, { empty: true }],
      [{ empty: false, type: "GHOST" }, { empty: true }],
      [{ empty: true }, { empty: true }],
    ];
    // game.currentPieceGrid = [
    //   [
    //     { empty: false, type: "COLORED" },
    //     { empty: false, type: "COLORED" },
    //   ],
    //   [{ empty: true }, { empty: true }],
    //   [{ empty: true }, { empty: true }],
    // ];
    const expectedGrid = [
      [
        { empty: false, type: "COLORED" },
        { empty: false, type: "COLORED" },
      ],
      [{ empty: false, type: "GHOST" }, { empty: true }],
      [
        { empty: false, type: "COLORED" },
        { empty: false, type: "COLORED" },
      ],
    ];
    game.getCurrentGridState();
    const grid = game.state.grid;
    assert.deepEqual(grid, expectedGrid);
  });
});
