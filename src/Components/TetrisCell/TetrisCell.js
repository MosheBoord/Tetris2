import "./TetrisCell.css";
import TetrisPiece from "./../../Game/TetrisPiece/TetrisPiece.js";

function getCellContent(type, value) {
  if (
    type === TetrisPiece.COLORED ||
    type === TetrisPiece.GHOST ||
    type === TetrisPiece.RAINBOW
  ) {
    let cellOverAndUnderlayStyle;
    if (type === TetrisPiece.RAINBOW) {
      cellOverAndUnderlayStyle = {};
    } else {
      cellOverAndUnderlayStyle = {
        backgroundColor: value,
      };
    }
    return (
      <>
        <div
          className="top-left cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to top right, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="top-middle cell-part"
          //   style={{
          //     backgroundColor: value,
          //   }}
        ></div>
        <div
          className="top-right cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to top left, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="left-top cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to bottom left, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="left-middle cell-part"
          //   style={{
          //     backgroundColor: value,
          //   }}
        ></div>
        <div
          className="left-bottom cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to top left, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="bottom-left cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to bottom right, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="bottom-middle cell-part"
          //   style={{
          //     backgroundColor: value,
          //   }}
        ></div>
        <div
          className="bottom-right cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to bottom left, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="right-top cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to bottom right, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="right-middle cell-part"
          //   style={{
          //     backgroundColor: value,
          //   }}
        ></div>
        <div
          className="right-bottom cell-part"
          //   style={{
          //     backgroundImage: `linear-gradient(to top right, transparent 50%, ${value} 0)`,
          //   }}
        ></div>
        <div
          className="center cell-part"
          //   style={{
          //     backgroundColor: value,
          //   }}
        ></div>
        <div
          className={`cell-color-overlay ${
            type === TetrisPiece.RAINBOW ? "rainbow" : ""
          }`}
          style={cellOverAndUnderlayStyle}
        ></div>
        <div
          className={`cell-color-underlay ${
            type === TetrisPiece.RAINBOW ? "rainbow" : ""
          }`}
          style={cellOverAndUnderlayStyle}
        ></div>
        {type === TetrisPiece.GHOST ? (
          <div className="black-center-overlay cell-part"></div>
        ) : null}
      </>
    );
  } else if (type === TetrisPiece.TEXT) {
    return <div className="text-cell">{value}</div>;
  }
}

function TetrisCell({ type, value, cellWidth }) {
  const opacity = type === TetrisPiece.RAINBOW ? value : 100;
  return (
    // <div className="tetris-cell">
    <div className="tetris-cell" style={{ width: cellWidth, opacity }}>
      {getCellContent(type, value)}
    </div>
  );
}

export default TetrisCell;
