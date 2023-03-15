import "./TetrisFillBar.css";

export default function TetrisFillBar({
  fillBar,
  color,
  filledLevelTransition,
}) {
  // const TetrisFillBarStyleVariables =
  const filledBarShinePercentage = 25;
  const filledBarShineHeight =
    (100 / fillBar.filledLevel) * filledBarShinePercentage;
  return (
    <>
      {/* <style>.tetris-fill-bar {}</style> */}
      <div
        className="tetris-fill-bar"
        style={{
          "--fill-bar-background-color": "grey",
          "--filled-level-percentage": fillBar.filledLevel + "%",
          "--potential-filled-level-percentage":
            fillBar.potentialFilledLevel + "%",
          "--fill-bar-color": color,
          "--filled-bar-shine-height": filledBarShineHeight + "%",
          "--filled-bar-transition": filledLevelTransition,
        }}
      >
        <div className="filled-bar">
          <div className="filled-bar-shine"></div>
        </div>
        <div className="potential-filled-bar"></div>

        <div className="unfilled-bar"></div>
      </div>
    </>
  );
}
