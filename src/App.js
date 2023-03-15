import { useState } from "react";
import "./App.css";
import TetrisGrid from "./Components/TetrisGrid/TetrisGrid.js";
import TetrisFillBar from "./Components/TetrisFillBar/TetrisFillBar.js";
import TetrisGame from "./Game/TetrisGame.js";
import KeyboardController from "./Game/KeyboardController.js";
import TetrisPauseMenu from "./Components/TetrisPauseMenu/TetrisPauseMenu.js";
import SettingsDialog from "./Components/SettingsDialog/SettingsDialog.js";

const game = new TetrisGame();

const keyboardController = new KeyboardController();

keyboardController.mapKeyDown("ArrowLeft", () => {
  game.inputEvent("left");
});

keyboardController.mapKeyDown("ArrowRight", () => {
  game.inputEvent("right");
});

keyboardController.mapKeyDown("ArrowDown", () => {
  game.inputEvent("down");
});

keyboardController.mapKeyDown("ArrowUp", () => {
  game.inputEvent("up");
});

keyboardController.mapKeyDown("a", () => {
  game.inputEvent("rotateCounterClockwise");
});

keyboardController.mapKeyDown("d", () => {
  game.inputEvent("rotateClockwise");
});

keyboardController.mapKeyDown(" ", () => {
  game.inputEvent("swap");
});

keyboardController.mapKeyDown("8", () => {
  game.inputEvent("speedUp");
});

keyboardController.mapKeyDown("Escape", () => {
  game.inputEvent("togglePause");
});

keyboardController.mapKeyDown("w", () => {
  game.inputEvent("activateTwoPiece");
});

keyboardController.mapKeyDown("s", () => {
  game.inputEvent("activateRainbowPieces");
});

window.addEventListener("blur", (event) => {
  // game.inputEvent("pause");
});

function App() {
  const [appState, setAppState] = useState({
    isRunning: true,
    grid: [],
    completedRows: {},
    nextPieceGrid: [],
    rainbowFilledBar: { filledLevel: 0, potentialFilledLevel: 0 },
    twoPieceFilledBar: { filledLevel: 0, potentialFilledLevel: 0 },
    twoPieceCount: 0,
    rainbowPieceCount: 0,
    displaySettingsDialog: false,
    score: 0,
    settings: {},
  });

  game.control(setAppState);

  const tetrisGameSize = {
    height: "100vh",
    width: "50vh",
  };

  const tetrisSideBarSize = {
    height: tetrisGameSize.height,
    width: "1.5vh",
  };

  const earnedRewardsSideBarSize = {
    height: tetrisGameSize.height,
    width: "3vh",
  };

  const nextPieceGridSize = {
    height: "10vh",
    width: "10vh",
  };

  const tetrisPauseMenuLayout = {
    height: "100vh",
    width: "63vh",
    top: "0",
    left: "0",
  };

  const earnedTwoPiece = [];
  // The second condition is a hack, to only display 30 because it looks weird after that. But, it isn't the right way to do it.
  for (let i = 0; i < appState.twoPieceCount && i < 33; i++) {
    earnedTwoPiece.push({
      color: "purple",
    });
  }

  const earnedRainbowPiece = [];
  // The second condition is a hack, to only display 30 because it looks weird after that. But, it isn't the right way to do it.
  for (let i = 0; i < appState.rainbowPieceCount && i < 33; i++) {
    earnedRainbowPiece.push({
      color: "green",
    });
  }

  return (
    <div className="App">
      {/* <div className="AppHeader"></div> */}
      <div className="AppBody">
        <div className="LeftColumn"></div>
        <div className="Content">
          <div className="tetris-game">
            <div
              className="earned-fillbar-rewards-container"
              style={{ ...earnedRewardsSideBarSize }}
              key={"earned-two-pieces" + appState.twoPieceCount}
            >
              {earnedTwoPiece.map((piece) => {
                return (
                  <div
                    className="earned-reward"
                    style={{
                      backgroundColor: piece.color,
                      width: "70%",
                      margin: "15%",
                      height: "calc(.7 * 3vh)",
                    }}
                  >
                    <div className="earned-reward-shine"></div>
                  </div>
                );
              })}
            </div>
            <div
              className="TetrisFillBarContainer"
              style={{
                ...tetrisSideBarSize,
              }}
            >
              <TetrisFillBar
                fillBar={appState.twoPieceFilledBar}
                color="purple"
              ></TetrisFillBar>
            </div>
            <div
              className="TetrisGridContainer"
              style={{
                ...tetrisGameSize,
              }}
            >
              <TetrisGrid
                grid={appState.grid}
                rowHeight={100 / appState.grid.length}
                completedRows={appState.completedRows}
              ></TetrisGrid>
            </div>
            <div
              className="TetrisFillBarContainer"
              style={{
                ...tetrisSideBarSize,
              }}
            >
              <TetrisFillBar
                fillBar={appState.rainbowFilledBar}
                color="green"
                filledLevelTransition="height 1s"
              ></TetrisFillBar>
            </div>
            {appState.isRunning ? null : (
              <TetrisPauseMenu
                layout={tetrisPauseMenuLayout}
                game={game}
              ></TetrisPauseMenu>
            )}
            {appState.displaySettingsDialog ? (
              <SettingsDialog
                settings={appState.settings}
                game={game}
              ></SettingsDialog>
            ) : null}
            <div
              className="earned-fillbar-rewards-container"
              style={{ ...earnedRewardsSideBarSize }}
              key={"earned-rainbow-pieces" + appState.rainbowPieceCount}
            >
              {earnedRainbowPiece.map((piece) => {
                return (
                  <div
                    className="earned-reward"
                    style={{
                      backgroundColor: piece.color,
                      width: "70%",
                      margin: "15%",
                      height: "calc(.7 * 3vh)",
                    }}
                  >
                    <div className="earned-reward-shine"></div>
                  </div>
                );
              })}
            </div>
            <div
              className="right-side-panel"
              style={{
                width: "20vh",
              }}
            >
              <div className="right-side-panel-content">
                Next Piece
                <div
                  className="TetrisGridContainer"
                  style={{
                    ...nextPieceGridSize,
                  }}
                >
                  <TetrisGrid
                    grid={appState.nextPieceGrid}
                    rowHeight={100 / appState.nextPieceGrid.length}
                  ></TetrisGrid>
                </div>
                Score
                <div className="score">{appState.score}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="RightColumn"></div>
      </div>
      {/* <div className="AppFooter"></div> */}
    </div>
  );
}

game.start();

export default App;
