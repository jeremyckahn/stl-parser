import StlParser, { Solid, Triangle } from '../lib/index';

const simpleExample = `
solid simple
  facet normal 0 0 0
      outer loop
          vertex 0 0 0
          vertex 1 0 0
          vertex 1 1 1
      endloop
  endfacet
  facet normal 0 0 0
      outer loop
          vertex 0 0 0
          vertex 0 1 1
          vertex 1 1 1
      endloop
  endfacet
endsolid simple
`;

const simpleExample2 = `
solid simple2
  facet normal 0 0 0
      outer loop
          vertex 1 0 0
          vertex 1 1 0
          vertex 1 1 1
      endloop
  endfacet
  facet normal 0 0 0
      outer loop
          vertex 0 0 1
          vertex 0 1 1
          vertex 1 1 1
      endloop
  endfacet
endsolid simple2
`;

describe('StlParser', () => {
  let parser;

  beforeEach(() => {
    parser = new StlParser(simpleExample);
  });

  test('stores raw data', () => {
    expect(parser.data).toEqual(simpleExample);
  });

  test('stores trimmed data', () => {
    expect(parser.trimmedLines).toEqual([
      'solid simple',
      'facet normal 0 0 0',
      'outer loop',
      'vertex 0 0 0',
      'vertex 1 0 0',
      'vertex 1 1 1',
      'endloop',
      'endfacet',
      'facet normal 0 0 0',
      'outer loop',
      'vertex 0 0 0',
      'vertex 0 1 1',
      'vertex 1 1 1',
      'endloop',
      'endfacet',
      'endsolid simple',
    ]);
  });

  describe('static methods', () => {
    describe('parseVertices', () => {
      test('parses vertex data', () => {
        expect(
          StlParser.parseVertices([
            'vertex 0.360463 0 2.525',
            'vertex 0 0 2.98309',
            'vertex 0.360463 0.2 2.525',
          ])
        ).toEqual(
          new Triangle({
            v1: { x: 0.360463, y: 0, z: 2.525 },
            v2: { x: 0, y: 0, z: 2.98309 },
            v3: { x: 0.360463, y: 0.2, z: 2.525 },
          })
        );
      });
    });
  });

  describe('instance methods', () => {
    describe('parseStl', () => {
      test('returns parsed STL data', () => {
        expect(parser.parseStl()).toEqual({
          solids: {
            simple: new Solid([
              new Triangle({
                v1: { x: 0, y: 0, z: 0 },
                v2: { x: 1, y: 0, z: 0 },
                v3: { x: 1, y: 1, z: 1 },
              }),
              new Triangle({
                v1: { x: 0, y: 0, z: 0 },
                v2: { x: 0, y: 1, z: 1 },
                v3: { x: 1, y: 1, z: 1 },
              }),
            ]),
          },
        });
      });

      test('supports arbitrary number of solids', () => {
        parser = new StlParser([simpleExample, simpleExample2].join('\n'));

        expect(parser.parseStl()).toEqual({
          solids: {
            simple: new Solid([
              new Triangle({
                v1: { x: 0, y: 0, z: 0 },
                v2: { x: 1, y: 0, z: 0 },
                v3: { x: 1, y: 1, z: 1 },
              }),
              new Triangle({
                v1: { x: 0, y: 0, z: 0 },
                v2: { x: 0, y: 1, z: 1 },
                v3: { x: 1, y: 1, z: 1 },
              }),
            ]),

            simple2: new Solid([
              new Triangle({
                v1: { x: 1, y: 0, z: 0 },
                v2: { x: 1, y: 1, z: 0 },
                v3: { x: 1, y: 1, z: 1 },
              }),
              new Triangle({
                v1: { x: 0, y: 0, z: 1 },
                v2: { x: 0, y: 1, z: 1 },
                v3: { x: 1, y: 1, z: 1 },
              }),
            ]),
          },
        });
      });
    });

    describe('parseSolid', () => {
      test('returns parsed triangle instances', () => {
        const { linesParsed, triangles } = parser.parseSolid(0);

        expect(triangles).toEqual([
          new Triangle({
            v1: { x: 0, y: 0, z: 0 },
            v2: { x: 1, y: 0, z: 0 },
            v3: { x: 1, y: 1, z: 1 },
          }),
          new Triangle({
            v1: { x: 0, y: 0, z: 0 },
            v2: { x: 0, y: 1, z: 1 },
            v3: { x: 1, y: 1, z: 1 },
          }),
        ]);

        expect(linesParsed).toEqual(15);
      });
    });
  });
});

describe('Triangle', () => {
  let triangle;

  beforeEach(() => {
    triangle = new Triangle({
      v1: { x: 0, y: 0, z: 0 },
      v2: { x: 1, y: 0, z: 0 },
      v3: { x: 1, y: 1, z: 1 },
    });
  });

  describe('getters', () => {
    describe('area', () => {
      test('computes area', () => {
        expect(triangle.area).toEqual(0.7071067811865476);
      });
    });
  });
});

describe('Solid', () => {
  let solid;

  beforeEach(() => {
    solid = new Solid([
      new Triangle({
        v1: { x: 0, y: 0, z: 0 },
        v2: { x: 1, y: 0, z: 0 },
        v3: { x: 1, y: 1, z: 1 },
      }),
      new Triangle({
        v1: { x: 0, y: 0, z: 0 },
        v2: { x: 0, y: 1, z: 1 },
        v3: { x: 1, y: 1, z: 1 },
      }),
    ]);
  });

  describe('getters', () => {
    describe('area', () => {
      test('computes area', () => {
        expect(solid.area).toEqual(1.4142135623730951);
      });
    });

    describe('boundingBox', () => {
      test('computes boundingBox', () => {
        expect(solid.boundingBox).toEqual([
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 1 },
          { x: 0, y: 1, z: 0 },
          { x: 0, y: 1, z: 1 },
          { x: 1, y: 0, z: 0 },
          { x: 1, y: 0, z: 1 },
          { x: 1, y: 1, z: 0 },
          { x: 1, y: 1, z: 1 },
        ]);
      });
    });
  });
});
