class TetrisPiece {
  constructor() {
    this.cells = [];
    this.length = 0;
    this.name = "";
    this.spawnRow = 0;
    this.row = 0;
    this.column = 0;
    this.isGrounded = false;
  }

  addCell(cell) {
    // if (cell.x + 1 > this.length) {
    //   this.length = cell.x + 1;
    // }

    // if (cell.y + 1 > this.length) {
    //   this.length = cell.y + 1;
    // }

    this.cells.push(cell);
  }

  removeCell(cellToRemove) {
    this.cells = this.cells.filter(
      (cell) => cell.x !== cellToRemove.x || cell.y !== cellToRemove.y
    );

    // this.length = 0;
    // this.cells.forEach((cell) => {
    //   if (cell.x + 1 > this.length) {
    //     this.length = cell.x + 1;
    //   }

    //   if (cell.y + 1 > this.length) {
    //     this.length = cell.y + 1;
    //   }
    // });
  }

  rotateClockwise() {
    this.cells.forEach((cell) => {
      const x = cell.x;
      const y = cell.y;
      cell.x = this.length - 1 - y;
      cell.y = x;
    });
  }

  rotateCounterClockwise() {
    this.cells.forEach((cell) => {
      const x = cell.x;
      const y = cell.y;
      cell.x = y;
      cell.y = this.length - 1 - x;
    });
  }

  clone() {
    const clonedPiece = new TetrisPiece();
    clonedPiece.name = this.name;
    clonedPiece.spawnRow = this.spawnRow;
    clonedPiece.row = this.row;
    clonedPiece.column = this.column;
    clonedPiece.hasFallen = this.hasFallen;
    clonedPiece.length = this.length;
    clonedPiece.isGrounded = this.isGrounded;
    this.cells.forEach((cell) => {
      clonedPiece.addCell({
        x: cell.x,
        y: cell.y,
        type: cell.type,
        value: cell.value,
      });
    });
    return clonedPiece;
  }
}

TetrisPiece.COLORED = "COLORED";
TetrisPiece.GHOST = "GHOST";
TetrisPiece.TEXT = "TEXT";
TetrisPiece.RAINBOW = "RAINBOW";

export default TetrisPiece;
