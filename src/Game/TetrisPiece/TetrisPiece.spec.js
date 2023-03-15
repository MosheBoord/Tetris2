import TetrisPiece from "./TetrisPiece.js";
import assert from "assert";

describe("TetrisPiece.addCell", () => {
  it("updates piece length", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 0, y: 0 });
    piece.addCell({ x: 0, y: 1 });
    assert.equal(piece.length, 2);
    // expect(piece.length).toBe(1);
  });

  it("adds a new cell to the piece", () => {
    const piece = new TetrisPiece();
    const cellToAdd = { x: 0, y: 0 };
    piece.addCell(cellToAdd);
    assert.deepEqual(piece.cells, [cellToAdd]);
  });
});

describe("TetrisPiece.removeCell", () => {
  it("updates piece length", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 0, y: 0 });
    piece.addCell({ x: 0, y: 1 });
    piece.removeCell({ x: 0, y: 1 });
    assert.equal(piece.length, 1);
    piece.removeCell({ x: 0, y: 0 });
    assert.equal(piece.length, 0);
  });

  it("removes a cell from the piece", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 0, y: 1 });
    piece.addCell({ x: 0, y: 2 });
    piece.removeCell({ x: 0, y: 1 });
    assert.deepEqual(piece.cells, [{ x: 0, y: 2 }]);
  });
});

describe("TetrisPiece.rotateClockwise", () => {
  it("rotates the tetris piece clockwise", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 1, y: 0 });
    piece.addCell({ x: 4, y: 4 });
    piece.addCell({ x: 1, y: 2 });
    piece.rotateClockwise();
    assert.deepEqual(piece.cells, [
      { x: 4, y: 1 },
      { x: 0, y: 4 },
      { x: 2, y: 1 },
    ]);
  });
});

describe("TetrisPiece.rotateCounterClockwise", () => {
  it("rotates the tetris piece counter clockwise", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 4, y: 1 });
    piece.addCell({ x: 0, y: 4 });
    piece.addCell({ x: 2, y: 1 });
    piece.rotateCounterClockwise();
    assert.deepEqual(piece.cells, [
      { x: 1, y: 0 },
      { x: 4, y: 4 },
      { x: 1, y: 2 },
    ]);
  });
});

describe("TetrisPiece.clone", () => {
  it("returns a cloned version of the piece", () => {
    const piece = new TetrisPiece();
    piece.addCell({ x: 4, y: 1 });
    piece.addCell({ x: 0, y: 4 });
    piece.addCell({ x: 2, y: 1 });
    const clonedPiece = piece.clone();
    assert.deepEqual(piece, clonedPiece);
    assert.notEqual(piece, clonedPiece);
  });
});
