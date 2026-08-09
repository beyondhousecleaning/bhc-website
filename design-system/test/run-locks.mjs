/**
 * Lock-suite runner — the gate that makes the gate fail closed (CR-01).
 *
 * `node --test test/*.test.js` fails OPEN. An unquoted glob that matches
 * nothing is left as a literal by the shell, Node's test runner treats it as a
 * glob of its own, and a glob resolving to zero files is not an error:
 *
 *     $ node --test /tmp/nope/*.test.js
 *     1..0
 *     # tests 0
 *     # fail 0
 *     exit=0                       <-- green, asserting nothing
 *
 * Renaming, moving or deleting locks.test.js therefore left the D-13 required
 * status check green while it enforced nothing. ci.yml's own comment says "a
 * lock suite that runs but does not gate is not a lock"; this file is what
 * makes that true of the suite's own existence.
 *
 * Two independent closures, because either alone can be defeated:
 *   1. Zero matched files is a hard failure — catches rename/move/delete.
 *   2. The run must report at least MIN_TESTS passing tests — catches a suite
 *      that still exists but has been gutted, and catches a runner whose exit
 *      code stops meaning what we think it means.
 *
 * Zero dependencies and no build step, deliberately (D-12): this runs on a
 * clean checkout with no node_modules, which is what lets ci.yml's `locks` job
 * skip `npm ci` entirely and return a verdict even when the app build is broken.
 *
 *   node test/run-locks.mjs
 */

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));

/*
  RAISE this when locks are added. Do not lower it without writing down why —
  a shrinking lock suite is precisely the regression this file exists to catch,
  and lowering the floor to make a red run green defeats the whole mechanism.
*/
const MIN_TESTS = 14;

const files = readdirSync(TEST_DIR)
  .filter((name) => name.endsWith('.test.js'))
  .sort()
  .map((name) => join(TEST_DIR, name));

if (files.length === 0) {
  console.error(`no *.test.js files in ${TEST_DIR}`);
  console.error('  the design-system lock suite would have passed vacuously — refusing to report green');
  process.exit(1);
}

const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], {
  encoding: 'utf8',
});

const output = `${run.stdout || ''}${run.stderr || ''}`;
process.stdout.write(output);

if (run.error) {
  console.error(`could not run the lock suite: ${run.error.message}`);
  process.exit(1);
}

if (run.status !== 0) {
  process.exit(run.status === null ? 1 : run.status);
}

// The runner exited 0. Confirm it actually asserted something.
const countOf = (label) => {
  const m = output.match(new RegExp(`^# ${label} (\\d+)$`, 'm'));
  return m ? Number(m[1]) : NaN;
};
const passed = countOf('pass');
const failed = countOf('fail');

if (!Number.isFinite(passed) || !Number.isFinite(failed)) {
  console.error('could not read a test count from the TAP summary — refusing to report green');
  process.exit(1);
}

if (failed > 0) {
  console.error(`${failed} lock test(s) failed`);
  process.exit(1);
}

if (passed < MIN_TESTS) {
  console.error(
    `only ${passed} lock test(s) ran across ${files.length} file(s); at least ${MIN_TESTS} are expected`
  );
  console.error('  locks were removed, or the suite stopped being discovered — this is not a pass');
  process.exit(1);
}

console.log(`lock suite: ${passed} passing across ${files.length} file(s) (minimum ${MIN_TESTS})`);
