import "./TetrisPauseMenu.css";
import PauseMenu from "../PauseMenu/PauseMenu.js";
import PauseMenuButton from "../PauseMenu/PauseMenuButton/PauseMenuButton.js";

export default function TetrisPauseMenu({ layout, game }) {
  console.log("game", game);
  const { height, width, top, left } = layout;
  return (
    <PauseMenu layout={layout} heightPerButtonPercenatage={7}>
      <PauseMenuButton
        attributes={{
          value: "Resume",
          onClick: () => game.inputEvent("togglePause"),
        }}
      />
      <PauseMenuButton
        attributes={{
          value: "Restart",
          onClick: () => game.inputEvent("restart"),
        }}
      />
      <PauseMenuButton
        attributes={{
          value: "Settings",
          onClick: () => game.inputEvent("displaySettings"),
        }}
      />
    </PauseMenu>
  );
}

//  <div
//     className="pause-menu-button-container"
//     style={{
//       height: "30vh",
//       width: "30vh",
//       top: "calc((100vh - 30vh) / 2)",
//       left: `calc((${width} - 30vh) / 2)`,
//     }}
