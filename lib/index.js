const rWhitespace = /\s+/;
const parseVertexPointsFromLine = line => line.split(rWhitespace).map(Number);

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

  static parseVertices(vertexLines) {
    const [, v1X, v1Y, v1Z] = parseVertexPointsFromLine(vertexLines[0]);
    const [, v2X, v2Y, v2Z] = parseVertexPointsFromLine(vertexLines[1]);
    const [, v3X, v3Y, v3Z] = parseVertexPointsFromLine(vertexLines[2]);

    return {
      v1: { x: v1X, y: v1Y, z: v1Z },
      v2: { x: v2X, y: v2Y, z: v2Z },
      v3: { x: v3X, y: v3Y, z: v3Z },
    };
  }
}
