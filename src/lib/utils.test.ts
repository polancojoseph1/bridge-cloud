import { test } from 'node:test';
import assert from 'node:assert';
import { truncate } from './utils.ts';

test('truncate utility', async (t) => {
  await t.test('truncates string longer than n', () => {
    assert.strictEqual(truncate('hello world', 5), 'hello…');
  });

  await t.test('does not truncate string shorter than n', () => {
    assert.strictEqual(truncate('hello', 10), 'hello');
  });

  await t.test('does not truncate string equal to n', () => {
    assert.strictEqual(truncate('hello', 5), 'hello');
  });

  await t.test('handles empty string', () => {
    assert.strictEqual(truncate('', 5), '');
  });

  await t.test('handles n = 0', () => {
    assert.strictEqual(truncate('hello', 0), '…');
  });

  await t.test('handles very large n', () => {
    assert.strictEqual(truncate('hello', 1000), 'hello');
  });
});
