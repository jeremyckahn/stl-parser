const rWhitespace = /\s+/;
const parseVertexPointsFromLine = line => line.split(rWhitespace).map(Number);

export class Triangle {
  constructor({ v1, v2, v3 }) {
    Object.assign(this, { v1, v2, v3 });
  }
}

export default class StlParser {
  constructor(data) {
    this.data = data;

    this.trimmedLines = this.data.split('\n').reduce((acc, line) => {
      const trimmedLine = line.trim();

      if (trimmedLine) {
        acc.push(trimmedLine);
      }

      return acc;
    }, []);
  }

  /**
   * @param {Array.<string>} vertexLines Must have three array elements of STL
   * vertex strings
   * @returns {Triangle}
   */
  static parseVertices(vertexLines) {
    const [, v1X, v1Y, v1Z] = parseVertexPointsFromLine(vertexLines[0]);
    const [, v2X, v2Y, v2Z] = parseVertexPointsFromLine(vertexLines[1]);
    const [, v3X, v3Y, v3Z] = parseVertexPointsFromLine(vertexLines[2]);

    return new Triangle({
      v1: { x: v1X, y: v1Y, z: v1Z },
      v2: { x: v2X, y: v2Y, z: v2Z },
      v3: { x: v3X, y: v3Y, z: v3Z },
    });
  }

  // Assumes that startAtLine is the first line of a solid block
  parseSolid(startAtLine = 0) {
    let currentLineNumber = startAtLine;
    const { trimmedLines: lines } = this;
    const { length: numberOfLines } = lines;

    const [, solidName] = lines[currentLineNumber].split(rWhitespace);
    const triangles = [];
    currentLineNumber++;

    while (currentLineNumber < numberOfLines) {
      const line = lines[currentLineNumber];

      const lineChunks = line.split(rWhitespace);

      if (lineChunks.join(' ') === `endsolid ${solidName}`) {
        // The end of the solid has been found, so exit the loop
        break;
      }

      if (lineChunks[0] === 'vertex') {
        triangles.push(
          StlParser.parseVertices([
            lines[currentLineNumber],
            lines[currentLineNumber + 1],
            lines[currentLineNumber + 2],
          ])
        );

        currentLineNumber += 3;
        continue;
      }

      currentLineNumber++;
    }

    return triangles;
  }
}
