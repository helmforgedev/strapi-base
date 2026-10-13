// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { filterReleaseNotes } from './filter-release-notes.mjs';

test('removes a final Thank You section and its contributor mentions', () => {
  const releaseNotes = [
    '## 5.57.0',
    '',
    '### Security',
    '',
    '- Preserve this security fix.',
    '',
    '### Thank You',
    '',
    '- Contributor @example-user',
    '',
  ].join('\n');

  const result = filterReleaseNotes(releaseNotes);

  assert.equal(
    result,
    [
      '## 5.57.0',
      '',
      '### Security',
      '',
      '- Preserve this security fix.',
      '',
    ].join('\n'),
  );
});

test('resumes output at the next heading of the same or higher level', () => {
  const releaseNotes = [
    '## Release',
    '### Contributors: Thank You',
    '#### Community',
    '- Contributor @example-user',
    '### Compatibility',
    '- Preserve this compatibility note.',
    '## Upgrade',
    '- Preserve this upgrade note.',
  ].join('\n');

  const result = filterReleaseNotes(releaseNotes);

  assert.equal(
    result,
    [
      '## Release',
      '### Compatibility',
      '- Preserve this compatibility note.',
      '## Upgrade',
      '- Preserve this upgrade note.',
    ].join('\n'),
  );
});

test('preserves release notes without a Thank You heading', () => {
  const releaseNotes = [
    '## Release',
    '### Fixes',
    '- Thank you for reporting this regression.',
  ].join('\n');

  assert.equal(filterReleaseNotes(releaseNotes), releaseNotes);
});

test('preserves CRLF line endings while removing the section', () => {
  const releaseNotes = [
    '## Release',
    '### Fixes',
    '- Preserve this fix.',
    '### THANK YOU',
    '- Contributor @example-user',
    '### Security',
    '- Preserve this security note.',
  ].join('\r\n');

  const result = filterReleaseNotes(releaseNotes);

  assert.equal(
    result,
    [
      '## Release',
      '### Fixes',
      '- Preserve this fix.',
      '### Security',
      '- Preserve this security note.',
    ].join('\r\n'),
  );
});

test('filters release notes received through standard input', () => {
  const scriptPath = fileURLToPath(
    new URL('./filter-release-notes.mjs', import.meta.url),
  );
  const result = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    input: [
      '### Fixes',
      '- Preserve this fix.',
      '### Thank You',
      '- Contributor @example-user',
    ].join('\n'),
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '### Fixes\n- Preserve this fix.');
});
