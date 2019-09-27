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

  // it('stores trimmed data', () => {
  // assert.equal(
  // parser.trimmedLines,
  // `solid simple
  // facet normal 0 0 0
  // outer loop
  // vertex 0 0 0
  // vertex 1 0 0
  // vertex 1 1 1
  // endloop
  // endfacet
  // facet normal 0 0 0
  // outer loop
  // vertex 0 0 0
  // vertex 0 1 1
  // vertex 1 1 1
  // endloop
  // endfacet
  // endsolid simple`
  // );
  // });
});
