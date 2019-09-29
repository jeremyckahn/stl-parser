const rWhitespace = /\s+/;
const parseVertexPointsFromLine = line => line.split(rWhitespace).map(Number);

export class Triangle {
  constructor({ v1, v2, v3 }) {
    Object.assign(this, { v1, v2, v3 });
  }
}

export class Solid {
  constructor(triangles) {
    Object.assign(this, { triangles });
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

    this.stlData = this.parseStl();
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

  get numberOfTriangles() {
    return Object.values(this.stlData.solids).reduce(
      (acc, { triangles }) => acc + triangles.length,
      0
    );
  }

  parseStl() {
    let currentLineNumber = 0;
    const { trimmedLines: lines } = this;
    const { length: numberOfLines } = lines;

    const solids = {};

    while (currentLineNumber < numberOfLines) {
      const line = lines[currentLineNumber];
      const [linePrefix, solidName] = line.split(rWhitespace);

      if (linePrefix === 'solid') {
        const { linesParsed, triangles } = this.parseSolid(currentLineNumber);
        solids[solidName] = new Solid(triangles);
        currentLineNumber += linesParsed;
        continue;
      }

      currentLineNumber++;
    }

    return { solids };
  }

  // Assumes that startAtLine is the first line of a solid block
  parseSolid(startAtLine = 0) {
    // This function shares a bit of redundant boilerplate setup with parseStl.
    // These functions could be DRYed up a bit and consolidated into a
    // monolithic function, but separating them makes testing easier.  Lines
    // are only processed once for the entire parsing procedure, so it is an
    // O(n) operation even with the two while loops.

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

    return { triangles, linesParsed: currentLineNumber - startAtLine };
  }
}
