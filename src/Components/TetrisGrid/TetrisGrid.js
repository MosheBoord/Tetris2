import "./TetrisGrid.css";
import TetrisCell from "../TetrisCell/TetrisCell.js";

// const grid = getNewGrid();

// grid[1][1] = { type: "COLORED_CELL", value: "green" };

// console.log(grid);

function TetrisGrid({ grid, rowHeight, completedRows }) {
  // console.log(grid);
  // console.log(completedRows);
  return (
    <div className="TetrisGrid">
      {grid.map((row, index) => {
        return (
          <div className="row-container" style={{ height: rowHeight + "%" }}>
            <div
              className={`row${
                completedRows?.[index] ? " row-disappearing" : ""
              }`}
            >
              {row.map((cell) => {
                return (
                  <TetrisCell
                    className="tetris-cell"
                    {...cell}
                    cellWidth={100 / row.length + "%"}
                  ></TetrisCell>
                );
              })}
            </div>
            {completedRows?.[index] ? (
              <div
                className="completed-row"
                style={{
                  "--completed-row-color-gradient": row
                    .map((cell) => cell.value)
                    .join(", "),
                }}
              ></div>
            ) : null}
            {completedRows?.[index] ? (
              <div className="completed-row-white"></div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default TetrisGrid;

// function getNewGrid() {
//   const grid = [];
//   for (let i = 0; i < 20; i++) {
//     const row = [];
//     for (let j = 0; j < 10; j++) {
//       row.push({});
//     }
//     grid.push(row);
//   }
//   return grid;
// }
