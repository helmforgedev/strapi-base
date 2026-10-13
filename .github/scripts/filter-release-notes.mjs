// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HEADING_PATTERN = /^ {0,3}(#{1,6})[\t ]+(.+?)[\t ]*#*[\t ]*$/;
const OPENING_FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/;
const CLOSING_FENCE_PATTERN = /^ {0,3}(`+|~+)[\t ]*$/;
const THANK_YOU_PATTERN = /\bthank[\t ]+you\b/i;

/**
 * Remove contributor acknowledgement sections from Markdown release notes.
 *
 * @param {string} releaseNotes Markdown copied from an upstream release.
 * @returns {string} Release notes without headings containing "Thank You".
 */
export function filterReleaseNotes(releaseNotes) {
  const lineEnding = releaseNotes.includes('\r\n') ? '\r\n' : '\n';
  const lines = releaseNotes.split(/\r?\n/);
  const filtered = [];
  let activeFence = null;
  let omittedHeadingLevel = null;

  for (const line of lines) {
    if (activeFence !== null) {
      const closingFence = line.match(CLOSING_FENCE_PATTERN);
      if (
        closingFence &&
        closingFence[1][0] === activeFence.marker &&
        closingFence[1].length >= activeFence.length
      ) {
        activeFence = null;
      }

      if (omittedHeadingLevel === null) {
        filtered.push(line);
      }
      continue;
    }

    const openingFence = line.match(OPENING_FENCE_PATTERN);
    if (openingFence) {
      activeFence = {
        length: openingFence[1].length,
        marker: openingFence[1][0],
      };

      if (omittedHeadingLevel === null) {
        filtered.push(line);
      }
      continue;
    }

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
