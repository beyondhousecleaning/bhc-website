/**
 * THROWAWAY FILE — DELETE ME.
 *
 * This file exists for one reason only: to prove D-13 end-to-end. D-13 says a
 * lock suite that runs but does not gate is not a lock. A workflow that exits
 * non-zero in theory is not evidence; a GitHub Actions run that actually
 * concluded `failure` is. This file is the deliberate failure that produces
 * that evidence.
 *
 * The `locks` job runs `node --test design-system/test/*.test.js`, so any file
 * matching that glob is picked up automatically. That is why a separate
 * throwaway file is used rather than editing locks.test.js — a botched revert
 * of the real lock suite is the one failure mode worth engineering out of this
 * exercise entirely.
 *
 * It MUST be deleted in the same plan that created it
 * (01-05, Task 1). If you are reading this on any branch, it did not get
 * cleaned up and should be removed on sight.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

/* --- D-13 negative control — this assertion always fails ----------------- */

test('CI gate probe: a failing lock must turn the GitHub Actions run red', () => {
  assert.equal(
    'this-lock-is-deliberately-broken',
    'green',
    'intentional failure — proves the CI gate can go red (D-13). Delete this file.'
  );
});
