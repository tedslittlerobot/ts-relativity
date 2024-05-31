import test from 'ava';
import { readFileSync } from 'node:fs';

['top.js', 'foo/depth-one.js', 'foo/bar/depth-two.js']
  .forEach(path => {
    test(`Check ${path}`, t => {
      const actual = readFileSync(`test/run/${path}`).toString();
      const expected = readFileSync(`test/target/${path}`).toString();

      t.is(actual, expected);
    });
  });
