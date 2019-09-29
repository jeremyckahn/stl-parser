const rWhitespace = /\s+/;
const parseVertexPointsFromLine = line => line.split(rWhitespace).map(Number);

export class Triangle {
  constructor({ v1, v2, v3 }) {
    Object.assign(this, { v1, v2, v3 });
  }

  get area() {
    // Math here is adapted from:
    //   https://community.khronos.org/t/how-can-i-find-the-area-of-a-3d-triangle/49777/2
    //   https://www.mathsisfun.com/algebra/vectors-cross-product.html
    const { v1, v2, v3 } = this;

    const vec1 = {
      x: v2.x - v1.x,
      y: v2.y - v1.y,
      z: v2.z - v1.z,
    };

    const vec2 = {
      x: v3.x - v1.x,
      y: v3.y - v1.y,
      z: v3.z - v1.z,
    };

    const vec3 = {
      x: vec1.y * vec2.z - vec1.z * vec2.y,
      y: vec1.z * vec2.x - vec1.x * vec2.z,
      z: vec1.x * vec2.y - vec1.y * vec2.x,
    };

    return 0.5 * Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z);
  }
}

export class Solid {
  constructor(triangles) {
    Object.assign(this, { triangles });
  }

  get area() {
    return this.triangles.reduce((acc, { area }) => acc + area, 0);
  }

  get boundingBox() {
    const { minX, maxX, minY, maxY, minZ, maxZ } = this.triangles.reduce(
      (acc, { v1, v2, v3 }) => {
        acc.minX = Math.min(acc.minX, v1.x, v2.x, v3.x);
        acc.maxX = Math.max(acc.maxX, v1.x, v2.x, v3.x);

        acc.minY = Math.min(acc.minY, v1.y, v2.y, v3.y);
        acc.maxY = Math.max(acc.maxY, v1.y, v2.y, v3.y);

        acc.minZ = Math.min(acc.minZ, v1.z, v2.z, v3.z);
        acc.maxZ = Math.max(acc.maxZ, v1.z, v2.z, v3.z);

        return acc;
      },
      {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        minZ: 0,
        maxZ: 0,
      }
    );

    return [
      { x: minX, y: minY, z: minZ },
      { x: minX, y: minY, z: maxZ },
      { x: minX, y: maxY, z: minZ },
      { x: minX, y: maxY, z: maxZ },
      { x: maxX, y: minY, z: minZ },
      { x: maxX, y: minY, z: maxZ },
      { x: maxX, y: maxY, z: minZ },
      { x: maxX, y: maxY, z: maxZ },
    ];
  }

  get numberOfTriangles() {
    return this.triangles.length;
  }

  toString() {
    /* eslint-disable indent */
    return `Number of Triangles: ${this.numberOfTriangles}
Surface Area: ${this.area}
Bounding Box: ${this.boundingBox
      .map(point => JSON.stringify(point))
      .join(', ')}`;
    /* eslint-enable indent */
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

  toString() {
    const { solids } = this.stlData;

    return Object.keys(solids)
      .map(
        solidName => `${solidName}:

${solids[solidName]}
`
      )
      .join('\n');
  }
}
