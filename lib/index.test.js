import StlParser from '../lib/index';
import path from 'path';

import { readFileSync } from 'fs';

/* eslint-disable no-unused-vars */
const fixture = readFileSync(path.join(__dirname, 'fixtures/moon.stl'), 'utf8');
/* eslint-enable no-unused-vars */

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

describe('stl-parser', () => {
  let parser;

  beforeAll(() => {
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

  describe('parseVertices', () => {
    test('parses vertex data', () => {
      expect(
        StlParser.parseVertices([
          'vertex 0.360463 0 2.525',
          'vertex 0 0 2.98309',
          'vertex 0.360463 0.2 2.525',
        ])
      ).toEqual({
        v1: { x: 0.360463, y: 0, z: 2.525 },
        v2: { x: 0, y: 0, z: 2.98309 },
        v3: { x: 0.360463, y: 0.2, z: 2.525 },
      });
    });
  });
});
