// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HEADING_PATTERN = /^ {0,3}(#{1,6})[\t ]+(.+?)[\t ]*#*[\t ]*$/;
const THANK_YOU_PATTERN = /\bthank[\t ]+you\b/i;

export function filterReleaseNotes(releaseNotes) {
  const lineEnding = releaseNotes.includes('\r\n') ? '\r\n' : '\n';
  const lines = releaseNotes.split(/\r?\n/);
  const filtered = [];
  let omittedHeadingLevel = null;

  for (const line of lines) {
    const heading = line.match(HEADING_PATTERN);
    const headingLevel = heading ? heading[1].length : null;

    if (omittedHeadingLevel !== null) {
      if (headingLevel === null || headingLevel > omittedHeadingLevel) {
        continue;
      }

      omittedHeadingLevel = null;
    }

    if (heading && THANK_YOU_PATTERN.test(heading[2])) {
      omittedHeadingLevel = headingLevel;
      continue;
    }

    filtered.push(line);
  }

  return filtered.join(lineEnding);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(filterReleaseNotes(readFileSync(0, 'utf8')));
}
