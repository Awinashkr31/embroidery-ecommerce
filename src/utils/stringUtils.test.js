import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, slugify } from './stringUtils.js';

test('normalize', (t) => {
  assert.strictEqual(normalize('  Hello World  '), 'hello world');
  assert.strictEqual(normalize(null), '');
  assert.strictEqual(normalize(undefined), '');
  assert.strictEqual(normalize(''), '');
});

test('slugify', (t) => {
  assert.strictEqual(slugify('  Hello World  '), 'hello-world');
  assert.strictEqual(slugify('Hello @World!'), 'hello-world');
  assert.strictEqual(slugify('Home Decor'), 'home-decor');
});
