import VideoGame from "./VideoGame.js";
import piecesData from "./pieces-data.json";
import TetrisPiece from "./TetrisPiece/TetrisPiece.js";
import seedrandom from "seedrandom";

export default class TetrisGame extends VideoGame {
  constructor() {
    super();
    this.setupInitialApp();

    this.onInputEvent("left", () => {
      this.horizontalMovement = -1;
    });

    this.onInputEvent("right", () => {
      this.horizontalMovement = 1;
    });

    this.onInputEvent("down", () => {
      this.verticalMovement = Math.floor(this.verticalMovement + 1);
    });

    this.onInputEvent("up", () => {
      this.upCommand = true;
    });

    this.onInputEvent("swap", () => {
      if (this.canSwap) {
        this.swapCommand = true;
      }
    });

    this.onInputEvent("speedUp", () => {
      this.verticleSpeed += 0.01;
    });

    this.onInputEvent("rotateCounterClockwise", () => {
      this.rotateCounterClockwise = true;
    });

    this.onInputEvent("rotateClockwise", () => {
      this.rotateClockwise = true;
    });

    this.onInputEvent("togglePause", () => {
      if (this.isRunning) {
        this.isRunning = false;
        this.state.isRunning = false;
      } else if (this.state.displaySettingsDialog) {
        this.state.displaySettingsDialog = false;
      } else {
        this.isRunning = true;
        this.state.isRunning = true;
      }
    });

    this.onInputEvent("pause", () => {
      this.isRunning = false;
      this.state.isRunning = false;
    });

    this.onInputEvent("restart", () => {
      this.setupInitialApp();
    });

    this.onInputEvent("displaySettings", () => {
      this.state.displaySettingsDialog = true;
    });

    this.onInputEvent("activateTwoPiece", () => {
      if (this.state.twoPieceCount && this.currentPiece.name !== "2") {
        this.activateTwoPiece = true;
      }
    });

    this.onInputEvent("activateRainbowPieces", () => {
      if (this.state.rainbowPieceCount) {
        this.activateRainbowPieces = true;
      }
    });
  }

  setupInitialApp() {
    // this.frameRateInMilliseconds = 1000 / 60;
    this.isRunning = true;
    this.pieceFallRate = 100;
    this.verticalMovement = 0;
    this.verticleSpeed = 0.01;
    this.rainbowPiecesFallingSpeed = 0.2;
    this.garbagePieceFallingSpeed = 0.2;
    this.timers = [];
    this.counters = [];
    this.gridHeight = 20;
    this.gridWidth = 10;
    this.nextPieceHeight = 4;
    this.nextPieceWidth = 4;
    this.amountOfGroundFrames = 200;
    this.amountOfPieceSetsInQueue = 3;
    this.framesStillLimit = 30;
    this.rowClearFramesRate = 42;
    this.gainedTwoPiecePotentialFillLevel = 5;
    this.lossPerFrameTwoPieceFillLevel = 0.01;
    this.difficultyIncreasePerFrame = 0.000003;
    this.gainedRainbowPoints = 3;
    this.displayTwoPiecePotentiallFillLevel = true;
    this.twoPieceFilledBarPotentialLevel = 0;
    this.initialCountTillNextGarbagePiece = 23;
    this.piecesTillNextGarbagePiece = this.initialCountTillNextGarbagePiece;
    this.endingCountTillNextGarbagePiece = 3;
    this.paintGhost = true;
    this.upCommand = false;
    this.swapCommand = false;
    this.canSwap = true;
    this.useSeed = true;
    this.activateTwoPiece = false;
    this.activateRainbowPieces = false;
    this.seed = "I Piece First";
    this.seed = "J first!!";
    // this.seed = "L first.";
    // this.seed = "S Piece First";
    // this.seed = "O Piece First";
    // this.seed = "Z Piece First";
    // this.seed = "T Piece First";
    let settings = JSON.parse(localStorage.getItem("settings"));

    console.log("settings...", settings);

    if (settings) {
      if (!settings.useCustomSeed) {
        settings.seed = this.getRandomSeed();
      }
    } else {
      settings = {
        seed: this.getRandomSeed(),
        useCustomSeed: false,
      };
    }

    this.seed = settings.seed;

    this.rng = this.createRandomNumberGenerator();
    this.pieces = this.getPieces();
    this.pieceQueue = this.setupPieceQueue();
    this.previouslyPlacedCellsGrid = this.getNewGrid();
    // this.currentPieceGrid = this.getNewGrid();
    this.ghostPieceGrid = this.getNewGrid();
    this.rainbowPieces = this.getRainbowPieces();
    this.horizontalSpeed = 0;
    this.horizontalMovement = 0;
    this.rotateCounterClockwise = false;
    this.rotateClockwise = false;
    this.paintRainbow = false;
    this.nextPiece = this.getRandomPieceFromQueue();

    // this.phase = this.getGameOverPhase();

    this.state = {
      framesRunning: 0,
      isRunning: true,
      grid: this.getNewGrid(),
      completedRows: {},
      nextPieceGrid: this.getNewGrid(this.nextPieceHeight, this.nextPieceWidth),
      rainbowFilledBar: { filledLevel: 0, potentialFilledLevel: 0 },
      twoPieceFilledBar: { filledLevel: 0, potentialFilledLevel: 0 },
      twoPieceCount: 0,
      rainbowPieceCount: 0,
      displaySettingsDialog: false,
      score: 0,
      settings,
    };
    this.phase = this.getStandardPieceFallingPhase();
    // this.phase = this.getRainbowPieceFallingPhase();
  }

  setSetting(setting, value) {
    this.state.settings[setting] = value;
  }

  saveSettings() {
    localStorage.setItem("settings", JSON.stringify(this.state.settings));
  }

  getRandomSeed() {
    const startingCharCode = 40;
    const endingCharCode = 125;
    const seedLength = 10;

    let seed = "";
    for (let i = 0; i < seedLength; i++) {
      const randomCode = Math.floor(
        Math.random() * (endingCharCode - startingCharCode) + startingCharCode
      );
      console.log(randomCode);
      seed += String.fromCharCode(randomCode);
    }
    return seed;
  }

  runNextFrame() {
    super.runNextFrame();
    if (this.isRunning) {
      this.state.framesRunning++;
      this.updateCountersAndTimers();
      this.phase.advance();
      this.getCurrentGridState();
    }
    this.refresh();
  }

  refresh() {
    this.setState({ ...this.state });
  }

  addTimer(time, callback) {
    this.timers.push({ framesLeft: time, activate: callback });
  }

  addCounter(name) {
    this.counters.push({ name, framesPassed: 0 });
  }

  removeCounter(name) {
    this.counters = this.counters.filter((counter) => counter.name !== name);
  }

  updateCountersAndTimers() {
    this.counters.forEach((counter) => {
      counter.framesPassed++;
    });

    const expiredTimers = [];

    this.timers.forEach((timer) => {
      timer.framesLeft--;
      if (timer.framesLeft <= 0) {
        timer.activate();
        expiredTimers.push(timer);
      }
    });

    this.timers = this.timers.filter((timer) => !expiredTimers.includes(timer));
  }

  getCurrentGridState() {
    const grid = this.getNewGrid();
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (!this.previouslyPlacedCellsGrid[i][j].empty) {
          grid[i][j] = { ...this.previouslyPlacedCellsGrid[i][j] };
        }
      }
    }

    if (this.paintRainbow) {
      this.rainbowPieces.forEach((piece) => {
        piece.cells.forEach((cell) => {
          if (cell.y + piece.row >= 0) {
            grid[cell.y + piece.row][cell.x + piece.column] = cell;
          }
        });
      });
    } else {
      if (this.paintGhost) {
        const ghostPiece = this.currentPiece.clone();
        ghostPiece.cells.forEach((cell) => {
          cell.type = TetrisPiece.GHOST;
        });

        this.movePieceDownAsFarAsPossible(ghostPiece);

        ghostPiece.cells.forEach((cell) => {
          if (cell.y + ghostPiece.row >= 0) {
            grid[cell.y + ghostPiece.row][cell.x + ghostPiece.column] = cell;
          }
        });
      }

      this.currentPiece.cells.forEach((cell) => {
        if (cell.y + this.currentPiece.row >= 0) {
          grid[cell.y + this.currentPiece.row][
            cell.x + this.currentPiece.column
          ] = cell;
        }
      });
    }

    this.state.grid = grid;

    this.getPieceGrid(this.nextPiece);

    // const nextPieceGrid = this.getNewGrid(
    //   this.nextPieceHeight,
    //   this.nextPieceWidth
    // );
    const nextPieceGrid = this.getPieceGrid(this.nextPiece);
    // for (let i = 0; i < nextPieceGrid.length; i++) {
    //   for (let j = 0; j < nextPieceGrid[0].length; j++) {
    this.nextPiece.cells.forEach((cell) => {
      nextPieceGrid[cell.y + 1][cell.x + 1] = cell;
    });
    //   }
    // }
    this.state.nextPieceGrid = nextPieceGrid;
  }

  movePieceDownAsFarAsPossible(piece) {
    let offset = { x: 0, y: 1 };
    while (this.canPieceBePlaced(piece, offset)) {
      offset.y++;
    }
    piece.row += offset.y - 1;
  }

  getStandardPieceFallingPhase() {
    let timeInAir = 0;
    const startingPotentialTwoPieceFillLevel =
      this.state.twoPieceFilledBar.filledLevel;
    // let framesTillNextFall = this.pieceFallRate;
    this.upCommand = false;
    this.swapCommand = false;
    let hasLanded = false;
    let groundFrames = this.amountOfGroundFrames;
    let framesStill = 0;
    this.verticalMovement = 0;
    this.canSwap = true;
    this.paintGhost = true;

    this.nextPiece.column = Math.floor(
      this.gridWidth / 2 - this.nextPiece.length / 2
    );

    if (this.nextPieceIsTwoPiece) {
      this.currentPiece = this.getTwoPiece();
      this.nextPieceIsTwoPiece = false;
    } else if (this.piecesTillNextGarbagePiece <= 0) {
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.getRandomPieceFromQueue();
      this.piecesTillNextGarbagePiece = Math.floor(
        this.initialCountTillNextGarbagePiece -
          (this.initialCountTillNextGarbagePiece -
            this.endingCountTillNextGarbagePiece) *
            this.state.framesRunning *
            this.difficultyIncreasePerFrame
      );
      return this.getGarbagePhase();
    } else {
      this.currentPiece = this.nextPiece;
      // let testingBug = this.rng.generateRandomNumber(this.seed) * 4;

      // for (let i = 0; i < testingBug; i++) {
      //   this.currentPiece.rotateClockwise();
      // }
      this.nextPiece = this.getRandomPieceFromQueue();

      if (this.piecesTillNextGarbagePiece <= 1) {
        this.nextPiece.cells.forEach((cell) => {
          cell.value = "black";
          this.canSwap = false;
        });
      }
      this.piecesTillNextGarbagePiece--;
    }

    if (this.pieceCanMoveDown()) {
      this.currentPiece.row++;
    } else {
      return this.getGameOverPhase();
    }

    return {
      advance: () => {
        if (this.activateTwoPiece) {
          this.activateTwoPiece = false;
          this.state.twoPieceCount--;
          this.nextPieceIsTwoPiece = true;
          this.phase = this.getStandardPieceFallingPhase();
          this.phase.advance();
          return;
        }

        if (this.activateRainbowPieces) {
          this.paintRainbow = true;
          this.state.rainbowPieceCount--;
          this.phase = this.getRainbowPieceFallingPhase();
          this.phase.advance();
          return;
        }

        timeInAir++;
        this.state.score++;

        if (
          this.lossPerFrameTwoPieceFillLevel * timeInAir <
          this.gainedTwoPiecePotentialFillLevel
        ) {
          this.twoPieceFilledBarPotentialLevel =
            startingPotentialTwoPieceFillLevel +
            (this.gainedTwoPiecePotentialFillLevel -
              this.lossPerFrameTwoPieceFillLevel * timeInAir);
        } else {
          this.twoPieceFilledBarPotentialLevel =
            startingPotentialTwoPieceFillLevel;
        }

        if (this.displayTwoPiecePotentiallFillLevel) {
          this.state.twoPieceFilledBar.potentialFilledLevel =
            this.twoPieceFilledBarPotentialLevel;
        }

        if (this.upCommand) {
          this.upCommand = false;
          this.movePieceDownAsFarAsPossible(this.currentPiece);
          this.currentPieceLanded();
          return;
        }

        let hasMoved = false;
        let hasRotated = false;
        let hasSwapped = false;

        if (this.swapCommand) {
          this.swapCommand = false;
          hasSwapped = this.swapCurrentAndNextPieces();
        }

        // timeInAir++;
        // framesTillNextFall--;
        if (hasLanded) {
          groundFrames--;
        }
        this.verticalMovement +=
          this.verticleSpeed +
          (1 - this.verticleSpeed) *
            this.state.framesRunning *
            this.difficultyIncreasePerFrame;
        if (this.verticalMovement >= 1) {
          if (this.pieceCanMoveDown()) {
            this.currentPiece.row++;
            hasMoved = true;
            this.verticalMovement--;
          } else {
            if (groundFrames <= 0 || framesStill > this.framesStillLimit) {
              this.currentPieceLanded();
            }
          }
        }

        let hasMovedHorizontally = this.moveCurrentPieceHorizontally();
        hasMoved = hasMoved || hasMovedHorizontally;
        hasRotated = this.rotateCurrentPiece();
        if (!this.pieceCanMoveDown()) {
          this.currentPiece.isGrounded = true;
          hasLanded = true;
        } else {
          this.currentPiece.isGrounded = false;
        }

        if (hasMoved || hasRotated || hasSwapped || !hasLanded) {
          framesStill = 0;
        } else {
          framesStill++;
        }
      },
    };
  }

  getRainbowPieceFallingPhase() {
    this.verticalMovement = 0;

    return {
      advance: () => {
        this.verticalMovement += this.rainbowPiecesFallingSpeed;
        if (this.verticalMovement >= 1) {
          const removedPieces = [];
          this.verticalMovement--;
          this.rainbowPieces.forEach((piece) => {
            if (this.pieceCanMoveDown(piece)) {
              piece.row++;
            } else {
              removedPieces.push(piece);
              for (let row = this.gridHeight - 1; row >= 0; row--) {
                if (this.previouslyPlacedCellsGrid[row][piece.column].empty) {
                  this.previouslyPlacedCellsGrid[row][piece.column] = {
                    type: TetrisPiece.RAINBOW,
                    value: 1,
                  };
                  break;
                }
              }
            }
          });
          this.rainbowPieces = this.rainbowPieces.filter(
            (piece) => !removedPieces.includes(piece)
          );
        }

        if (!this.rainbowPieces.length) {
          this.activateRainbowPieces = false;
          this.paintRainbow = false;
          this.rainbowPieces = this.getRainbowPieces();
          this.phase = this.getClearCompletedRowsPhase();
        }
      },
    };
  }

  getGarbagePhase() {
    this.verticalMovement = 0;
    this.paintGhost = false;
    let x = 0;
    this.currentPiece.cells.forEach((cell) => {
      if (cell.x > x) {
        x = cell.x;
      }
      this.currentPiece.column = Math.floor(
        this.rng.generateRandomNumber() * (this.gridWidth - x)
      );
    });
    return {
      advance: () => {
        this.verticalMovement += this.garbagePieceFallingSpeed;
        if (this.verticalMovement >= 1) {
          if (this.pieceCanMoveDown()) {
            this.currentPiece.row++;
            this.verticalMovement--;
          } else {
            this.currentPieceLanded();
          }
        }
      },
    };
  }

  getClearCompletedRowsPhase() {
    // First attempt
    this.currentPiece = new TetrisPiece();
    const completedRows = [];
    let completedRowCount = 0;
    this.previouslyPlacedCellsGrid.forEach((row, index) => {
      if (this.rowIsComplete(row)) {
        completedRowCount++;
        this.state.completedRows[index] = true;
        completedRows.push(index);

        // Calculate score and dificulty logic goes here.
      }
    });

    // function clearRow(rowIndex) {
    this.addTimer(this.rowClearFramesRate, () => {
      completedRows.forEach((index) => {
        this.previouslyPlacedCellsGrid.splice(index, 1);
        this.previouslyPlacedCellsGrid.unshift(this.getNewRow(this.gridWidth));
      });

      this.state.rainbowFilledBar.filledLevel +=
        ((completedRowCount + 1) / 2) *
        completedRowCount *
        this.gainedRainbowPoints;
      this.state.rainbowFilledBar.potentialFilledLevel +=
        ((completedRowCount + 1) / 2) *
        completedRowCount *
        this.gainedRainbowPoints;

      if (this.state.rainbowFilledBar.filledLevel >= 100) {
        this.addTimer(60, () => {
          this.state.rainbowFilledBar.filledLevel -= 100;
          this.state.rainbowFilledBar.potentialFilledLevel =
            this.state.rainbowFilledBar.filledLevel;
          this.state.rainbowPieceCount++;
        });
      }

      this.state.completedRows = {};
      this.phase = this.getStandardPieceFallingPhase();
    });

    // clearRow(19);

    return {
      advance: () => {},
    };
  }

  getPausePhase(time, phase) {
    this.addTimer(time, () => {
      this.phase = phase;
    });
  }

  moveCurrentPieceHorizontally() {
    if (this.horizontalMovement < 1 && this.horizontalMovement > -1) {
      return false;
    }
    let hasMoved = false;
    if (
      this.canPieceBePlaced(this.currentPiece, {
        x: this.horizontalMovement,
        y: 0,
      })
    ) {
      this.currentPiece.column += this.horizontalMovement;
      hasMoved = true;
    } else if (
      this.currentPiece.isGrounded &&
      this.canPieceBePlaced(this.currentPiece, {
        x: this.horizontalMovement,
        y: -1,
      })
    ) {
      this.currentPiece.row--;
      hasMoved = true;
      this.currentPiece.column += this.horizontalMovement;
    }

    this.horizontalMovement = 0;
    return hasMoved;
  }

  rotateCurrentPiece() {
    let hasRotated = false;
    if (!this.rotateClockwise && !this.rotateCounterClockwise) {
      return hasRotated;
    }

    const clonedPiece = this.currentPiece.clone();
    const nextClonedPiece = this.nextPiece.clone();
    if (this.rotateClockwise) {
      clonedPiece.rotateClockwise();
      nextClonedPiece.rotateClockwise();
      this.rotateClockwise = false;
    }

    if (this.rotateCounterClockwise) {
      clonedPiece.rotateCounterClockwise();
      nextClonedPiece.rotateCounterClockwise();
      this.rotateCounterClockwise = false;
    }

    const offsetChecks = this.getOffsetChecks(clonedPiece);
    const closestAvailablealOffset = offsetChecks.find((offset) => {
      return this.canPieceBePlaced(clonedPiece, offset);
    });

    if (closestAvailablealOffset) {
      this.currentPiece = clonedPiece;
      this.nextPiece = nextClonedPiece;
      this.currentPiece.row += closestAvailablealOffset.y;
      this.currentPiece.column += closestAvailablealOffset.x;
      hasRotated = true;
    }

    return hasRotated;
  }

  swapCurrentAndNextPieces() {
    let hasSwapped = false;

    this.nextPiece.column = this.currentPiece.column;
    this.nextPiece.row = this.currentPiece.row;

    const nextPiece = this.nextPiece.clone();

    const offsetChecks = this.getOffsetChecks(nextPiece);
    const closestAvailableOffset = offsetChecks.find((offset) => {
      return this.canPieceBePlaced(nextPiece, offset);
    });

    if (closestAvailableOffset) {
      this.nextPiece = this.currentPiece;
      this.nextPiece.row = this.nextPiece.spawnRow;
      this.currentPiece = nextPiece;
      this.currentPiece.row += closestAvailableOffset.y;
      this.currentPiece.column += closestAvailableOffset.x;
      hasSwapped = true;
    }

    return hasSwapped;
  }

  getOffsetChecks(piece) {
    const halfPieceLength = Math.ceil(piece.length / 2);
    const offsets = [];
    for (let x = -halfPieceLength; x < halfPieceLength + 1; x++) {
      for (let y = -halfPieceLength; y < halfPieceLength + 1; y++) {
        offsets.push({ x, y });
      }
    }
    return offsets.sort((a, b) => {
      let shorterMovementDistance =
        a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y);
      if (shorterMovementDistance === 0) {
        return b.y - a.y;
      } else {
        return shorterMovementDistance;
      }
    });
  }

  pieceCanMoveDown(piece = this.currentPiece) {
    return this.canPieceBePlaced(piece, { x: 0, y: 1 });
  }

  canPieceBePlaced(piece, offset) {
    if (!piece.cells.length) {
      return false;
    }

    let canBePlaced = true;
    piece.cells.forEach((cell) => {
      if (cell.x + piece.column + offset.x < 0) {
        canBePlaced = false;
        return;
      }

      if (cell.x + piece.column + offset.x >= this.gridWidth) {
        canBePlaced = false;
        return;
      }

      if (cell.y + piece.row + offset.y < 0) {
        return;
      }

      if (cell.y + piece.row + offset.y >= this.gridHeight) {
        canBePlaced = false;
        return;
      }

      if (
        !this.previouslyPlacedCellsGrid[cell.y + piece.row + offset.y][
          cell.x + piece.column + offset.x
        ].empty
      ) {
        canBePlaced = false;
      }
    });
    return canBePlaced;
  }

  currentPieceLanded() {
    let gameIsOver = false;
    this.currentPiece.cells.forEach((cell) => {
      if (cell.y + this.currentPiece.row < 0) {
        gameIsOver = true;
      }
    });
    if (gameIsOver) {
      this.phase = this.getGameOverPhase();
      return;
    }

    this.earnTwoPiecePoints();

    this.currentPiece.cells.forEach((cell) => {
      this.previouslyPlacedCellsGrid[cell.y + this.currentPiece.row][
        cell.x + this.currentPiece.column
      ] = cell;
    });

    let rowsAreCompleted = false;
    //Logic to clear rows will go here.
    this.previouslyPlacedCellsGrid.forEach((row, index) => {
      if (this.rowIsComplete(row)) {
        // this.previouslyPlacedCellsGrid.splice(index, 1);
        // this.previouslyPlacedCellsGrid.unshift(this.getNewRow(this.gridWidth));
        rowsAreCompleted = true;
        // this.state.rainbowFilledBar.filledLevel += 10;
        // this.state.rainbowFilledBar.potentialFilledLevel += 10;
        // Calculate score and dificulty logic goes here.
      }
    });

    if (rowsAreCompleted) {
      this.phase = this.getClearCompletedRowsPhase();
    } else {
      this.phase = this.getStandardPieceFallingPhase();
    }

    // This logic may somewhat change to take into account other phases, such as garbage phase.
    // this.phase = this.getStandardPieceFallingPhase();
  }

  earnTwoPiecePoints() {
    this.state.twoPieceFilledBar.filledLevel =
      this.twoPieceFilledBarPotentialLevel;
    this.state.twoPieceFilledBar.potentialFilledLevel =
      this.state.twoPieceFilledBar.filledLevel +
      this.gainedTwoPiecePotentialFillLevel;

    // this.displayTwoPiecePotentiallFillLevel = false;
    // this.addTimer(6, () => {
    //   this.displayTwoPiecePotentiallFillLevel = true;
    // });

    if (this.state.twoPieceFilledBar.filledLevel >= 100) {
      this.state.twoPieceFilledBar.filledLevel -= 100;
      this.state.twoPieceFilledBar.potentialFilledLevel =
        this.state.twoPieceFilledBar.filledLevel +
        this.gainedTwoPiecePotentialFillLevel;
      this.displayTwoPiecePotentiallFillLevel = true;
      this.state.twoPieceCount++;
    }
  }

  rowIsComplete(row) {
    let complete = true;
    row.forEach((cell) => {
      if (cell.empty) {
        complete = false;
      }
    });
    return complete;
  }

  getGameOverPhase() {
    // this.frameRateInMilliseconds = 1000 / 1000;
    const gameOverGrid = this.getNewGrid();
    const cellCoordinates = [];
    // logic to paint game over grid here

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        gameOverGrid[y][x].type = TetrisPiece.COLORED;
        gameOverGrid[y][x].value = "red";
        gameOverGrid[y][x].empty = false;
        cellCoordinates.push({ x, y });
      }
    }

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid[y][x].empty = true;
      }
    }

    gameOverGrid[1][1].empty = false;
    gameOverGrid[1][1].type = TetrisPiece.TEXT;
    gameOverGrid[1][1].value = "G";
    gameOverGrid[1][2].empty = false;
    gameOverGrid[1][2].type = TetrisPiece.TEXT;
    gameOverGrid[1][2].value = "A";
    gameOverGrid[1][3].empty = false;
    gameOverGrid[1][3].type = TetrisPiece.TEXT;
    gameOverGrid[1][3].value = "M";
    gameOverGrid[1][4].empty = false;
    gameOverGrid[1][4].type = TetrisPiece.TEXT;
    gameOverGrid[1][4].value = "E";
    gameOverGrid[1][5].empty = false;
    gameOverGrid[1][5].type = TetrisPiece.TEXT;
    gameOverGrid[1][5].value = "O";
    gameOverGrid[1][6].empty = false;
    gameOverGrid[1][6].type = TetrisPiece.TEXT;
    gameOverGrid[1][6].value = "V";
    gameOverGrid[1][7].empty = false;
    gameOverGrid[1][7].type = TetrisPiece.TEXT;
    gameOverGrid[1][7].value = "E";
    gameOverGrid[1][8].empty = false;
    gameOverGrid[1][8].type = TetrisPiece.TEXT;
    gameOverGrid[1][8].value = "R";

    gameOverGrid[3][0].empty = true;
    gameOverGrid[3][1].empty = true;
    gameOverGrid[3][2].empty = true;
    gameOverGrid[3][7].empty = true;
    gameOverGrid[3][8].empty = true;
    gameOverGrid[3][9].empty = true;

    gameOverGrid[4][0].empty = true;
    gameOverGrid[4][9].empty = true;

    // gameOverGrid[5][0].empty = true;
    // gameOverGrid[5][9].empty = true;

    // gameOverGrid[6][2].empty = true;
    // gameOverGrid[6][3].empty = true;
    // gameOverGrid[6][6].empty = true;
    // gameOverGrid[6][7].empty = true;

    // gameOverGrid[7][2].empty = true;
    // gameOverGrid[7][3].empty = true;
    // gameOverGrid[7][6].empty = true;
    // gameOverGrid[7][7].empty = true;

    // gameOverGrid[9][4].empty = true;
    // gameOverGrid[9][5].empty = true;

    gameOverGrid[6][2].value = "yellow";
    gameOverGrid[6][3].value = "yellow";
    gameOverGrid[6][6].value = "yellow";
    gameOverGrid[6][7].value = "yellow";

    gameOverGrid[7][2].value = "yellow";
    gameOverGrid[7][3].value = "yellow";
    gameOverGrid[7][6].value = "yellow";
    gameOverGrid[7][7].value = "yellow";

    gameOverGrid[9][4].value = "yellow";
    gameOverGrid[9][5].value = "yellow";

    gameOverGrid[10][0].empty = true;
    gameOverGrid[10][9].empty = true;

    gameOverGrid[11][0].empty = true;
    gameOverGrid[11][1].empty = true;
    gameOverGrid[11][2].empty = true;
    gameOverGrid[11][4].empty = true;
    gameOverGrid[11][5].empty = true;
    gameOverGrid[11][7].empty = true;
    gameOverGrid[11][8].empty = true;
    gameOverGrid[11][9].empty = true;

    gameOverGrid[12][0].empty = true;
    gameOverGrid[12][2].empty = true;
    gameOverGrid[12][4].empty = true;
    gameOverGrid[12][5].empty = true;
    gameOverGrid[12][7].empty = true;
    gameOverGrid[12][9].empty = true;

    gameOverGrid[13][0].empty = true;
    gameOverGrid[13][2].empty = true;
    gameOverGrid[13][3].empty = true;
    gameOverGrid[13][4].empty = true;
    gameOverGrid[13][5].empty = true;
    gameOverGrid[13][6].empty = true;
    gameOverGrid[13][7].empty = true;
    gameOverGrid[13][9].empty = true;

    gameOverGrid[14][0].empty = true;
    gameOverGrid[14][3].empty = true;
    gameOverGrid[14][6].empty = true;
    gameOverGrid[14][9].empty = true;

    gameOverGrid[15][0].empty = true;
    gameOverGrid[15][1].empty = true;
    gameOverGrid[15][8].empty = true;
    gameOverGrid[15][9].empty = true;

    gameOverGrid[16][0].empty = true;
    gameOverGrid[16][1].empty = true;
    gameOverGrid[16][2].empty = true;
    gameOverGrid[16][7].empty = true;
    gameOverGrid[16][8].empty = true;
    gameOverGrid[16][9].empty = true;

    for (let y = 17; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid[y][x].empty = true;
      }
    }

    const gameOverGrid2 = this.getNewGrid();

    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid2[y][x].empty = gameOverGrid[y][x].empty;
        gameOverGrid2[y][x].value = gameOverGrid[y][x].value;
        gameOverGrid2[y][x].type = gameOverGrid[y][x].type;
      }
    }

    for (let y = 11; y < 19; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid2[y][x].empty = gameOverGrid[y + 1][x].empty;
        gameOverGrid2[y][x].value = gameOverGrid[y + 1][x].value;
        gameOverGrid2[y][x].type = gameOverGrid[y + 1][x].type;
      }
    }

    const gameOverGrid3 = this.getNewGrid();

    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid3[y][x].empty = gameOverGrid2[y][x].empty;
        gameOverGrid3[y][x].value = gameOverGrid2[y][x].value;
        gameOverGrid3[y][x].type = gameOverGrid2[y][x].type;
      }
    }

    for (let y = 11; y < 19; y++) {
      for (let x = 0; x < 10; x++) {
        gameOverGrid3[y][x].empty = gameOverGrid2[y + 1][x].empty;
        gameOverGrid3[y][x].value = gameOverGrid2[y + 1][x].value;
        gameOverGrid3[y][x].type = gameOverGrid2[y + 1][x].type;
      }
    }

    // gameOverGrid2[11][0].empty = true;
    // gameOverGrid2[11][2].empty = true;
    // gameOverGrid2[11][4].empty = true;
    // gameOverGrid2[11][5].empty = true;
    // gameOverGrid2[11][7].empty = true;
    // gameOverGrid2[11][9].empty = true;

    // gameOverGrid2[12][0].empty = true;
    // gameOverGrid2[12][2].empty = true;
    // gameOverGrid2[12][3].empty = true;
    // gameOverGrid2[12][4].empty = true;
    // gameOverGrid2[12][5].empty = true;
    // gameOverGrid2[12][6].empty = true;
    // gameOverGrid2[12][7].empty = true;
    // gameOverGrid2[12][9].empty = true;

    // gameOverGrid2[13][0].empty = true;
    // gameOverGrid2[13][3].empty = true;
    // gameOverGrid2[13][6].empty = true;
    // gameOverGrid2[13][9].empty = true;

    // gameOverGrid2[14][0].empty = true;
    // gameOverGrid2[14][1].empty = true;
    // gameOverGrid2[14][8].empty = true;
    // gameOverGrid2[14][9].empty = true;

    // gameOverGrid2[15][0].empty = true;
    // gameOverGrid2[15][1].empty = true;
    // gameOverGrid2[15][2].empty = true;
    // gameOverGrid2[15][7].empty = true;
    // gameOverGrid2[15][8].empty = true;
    // gameOverGrid2[15][9].empty = true;

    // for (let y = 16; y < 20; y++) {
    //   for (let x = 0; x < 10; x++) {
    //     gameOverGrid2[y][x].empty = true;
    //   }
    // }

    this.currentPiece = new TetrisPiece();
    this.ghostPiece = new TetrisPiece();

    if (this.useSeed) {
      cellCoordinates.sort(
        () => this.rng.generateRandomNumber(this.seed) - 0.5
      );
    } else {
      cellCoordinates.sort(() => this.rng.generateRandomNumber() - 0.5);
    }

    let startedAnimating = false;

    return {
      advance: () => {
        // Logic for game over phase will go here.
        const getNextGameOverCell = () => {
          const cellCoordinate = cellCoordinates.pop();
          this.previouslyPlacedCellsGrid[cellCoordinate.y][cellCoordinate.x] =
            gameOverGrid[cellCoordinate.y][cellCoordinate.x];
        };

        if (cellCoordinates.length) {
          getNextGameOverCell();
          getNextGameOverCell();
          getNextGameOverCell();
          getNextGameOverCell();
          getNextGameOverCell();
        } else if (!startedAnimating) {
          let mouth2;
          let mouth3;
          let mouth4;
          let mouth5;
          const mouthMovementSpeed = 2;
          const mouth1 = () => {
            this.addTimer(mouthMovementSpeed, () => {
              this.previouslyPlacedCellsGrid = gameOverGrid;
              this.addTimer(mouthMovementSpeed, mouth2);
            });
          };

          mouth2 = () => {
            this.addTimer(mouthMovementSpeed, () => {
              this.previouslyPlacedCellsGrid = gameOverGrid2;
              this.addTimer(mouthMovementSpeed, mouth3);
            });
          };

          mouth3 = () => {
            this.addTimer(mouthMovementSpeed, () => {
              this.previouslyPlacedCellsGrid = gameOverGrid3;
              this.addTimer(mouthMovementSpeed, mouth4);
            });
          };

          mouth4 = () => {
            this.addTimer(mouthMovementSpeed, () => {
              this.previouslyPlacedCellsGrid = gameOverGrid2;
              this.addTimer(mouthMovementSpeed, mouth5);
            });
          };

          mouth5 = () => {
            this.addTimer(mouthMovementSpeed, () => {
              this.previouslyPlacedCellsGrid = gameOverGrid2;
              this.addTimer(mouthMovementSpeed, mouth1);
            });
          };

          mouth2();
          // this.previouslyPlacedCellsGrid = gameOverGrid3;
          startedAnimating = true;
        }
      },
    };
  }

  getPieceGrid(piece) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;
    piece.cells.forEach((cell) => {
      if (cell.x < minX) {
        minX = cell.x;
      }

      if (cell.y < minY) {
        minY = cell.y;
      }

      if (cell.x > maxX) {
        maxX = cell.x;
      }

      if (cell.y > maxY) {
        maxY = cell.y;
      }
    });

    const length = Math.max(maxY - minY + 3, maxX - minX + 3);
    const grid = this.getNewGrid(length, length);
    return grid;
  }

  getNewGrid(height = this.gridHeight, width = this.gridWidth) {
    const grid = [];
    for (let i = 0; i < height; i++) {
      const row = this.getNewRow(width);
      grid.push(row);
    }
    return grid;
  }

  getNewRow(width) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push({ empty: true });
    }
    return row;
  }

  getRandomPieceFromQueue() {
    const index = Math.floor(
      (this.useSeed
        ? this.rng.generateRandomNumber(this.seed)
        : this.rng.generateRandomNumber()) * this.pieceQueue.length
    );
    const randomPiece = this.pieceQueue.splice(index, 1)[0];
    if (this.pieceQueue.length === 0) {
      this.pieceQueue = this.setupPieceQueue();
    }
    return randomPiece;
  }

  setupPieceQueue() {
    const queue = [];
    for (let i = 0; i < this.amountOfPieceSetsInQueue; i++) {
      this.pieces.forEach((piece) => {
        queue.push(piece.clone());
      });
    }
    return queue;
  }

  // Define new
  getPieces() {
    const pieces = piecesData.pieces.map((piece) => {
      const tetrisPiece = new TetrisPiece();
      tetrisPiece.name = piece.name;
      tetrisPiece.row = piece.spawnRow;
      tetrisPiece.spawnRow = piece.spawnRow;
      tetrisPiece.length = piece.length;
      tetrisPiece.column = Math.floor(this.gridWidth / 2 - piece.length / 2);
      piece.cells.forEach((cell) => {
        tetrisPiece.addCell({
          x: cell.x,
          y: cell.y,
          type: TetrisPiece.COLORED,
          value: piece.color,
        });
      });
      return tetrisPiece;
    });
    return pieces;
  }

  getTwoPiece() {
    const piece = new TetrisPiece();
    piece.name = "2";
    piece.row = -2;
    piece.spawnRow = -2;
    piece.length = 2;
    piece.column = Math.floor(this.gridWidth / 2 - piece.length / 2);
    piece.addCell({
      x: 0,
      y: 0,
      type: TetrisPiece.COLORED,
      value: "white",
    });
    piece.addCell({
      x: 0,
      y: 1,
      type: TetrisPiece.COLORED,
      value: "white",
    });
    return piece;
  }

  getRainbowPieces() {
    const pieces = [];
    for (let column = 0; column < this.gridWidth; column++) {
      const piece = new TetrisPiece();
      piece.column = column;
      piece.name = "rainbow";
      piece.row = -5;
      piece.spawnRow = -5;
      // piece.row = 5;
      // piece.spawnRow = 5;
      // piece.length = 3;

      piece.addCell({
        x: 0,
        y: 0,
        type: TetrisPiece.RAINBOW,
        value: 0.1,
      });

      piece.addCell({
        x: 0,
        y: 1,
        type: TetrisPiece.RAINBOW,
        value: 0.2,
      });

      piece.addCell({
        x: 0,
        y: 2,
        type: TetrisPiece.RAINBOW,
        value: 0.3,
      });

      piece.addCell({
        x: 0,
        y: 3,
        type: TetrisPiece.RAINBOW,
        value: 0.5,
      });

      piece.addCell({
        x: 0,
        y: 4,
        type: TetrisPiece.RAINBOW,
        value: 1,
      });

      pieces.push(piece);
    }
    return pieces;
  }

  createRandomNumberGenerator() {
    const seededGenerator = {};
    return {
      generateRandomNumber: (seed) => {
        if (seed) {
          if (!seededGenerator[seed]) {
            seededGenerator[seed] = new seedrandom(seed);
          }
          return seededGenerator[seed]();
        } else {
          return Math.random();
        }
      },
    };
  }
}
