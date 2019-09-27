import StlParser from '../lib/index';
import path from 'path';
import assert from 'assert';

import { readFileSync } from 'fs';

const fixture = readFileSync(path.join(__dirname, 'fixtures/moon.stl'), 'utf8');

describe('stl-parser', () => {
  let parser;

  before(() => {
    parser = new StlParser(fixture);
  });

  it('stores raw data', () => {
    assert.equal(parser.data, fixture);
  });
});
