#! /usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { argv } from 'node:process';

const [ sourceDir, destinationDir ] = argv.slice(2);

await replaceFilesInDirectory(destinationDir);

////////////////////////////////////////////////////////////////////////////////
///       Helpers                                                            ///
////////////////////////////////////////////////////////////////////////////////

/**
 * Recursively replace with relative imports in a given directory
 *
 * @param  {string} directory The directory to scan in
 * @param  {Number} depth     A marker to store the depth level we are currently in
 * @return Promise<void>
 */
async function replaceFilesInDirectory(directory, depth = 1) {
  (await readdir(directory, { withFileTypes: true }))
    .forEach(async item => {
      if (item.isDirectory()) {
        await replaceFilesInDirectory(`${directory}/${item.name}`, depth + 1)

        return;
      }

      if (item.name.endsWith('.js')) {
        await performReplacements(directory, item.name, depth);
      }
    })
}

/**
 * Perform the replacements in a given file
 *
 * @param  {string} directory
 * @param  {string} file
 * @param  {Number} depth
 * @return Promise<void>
 */
async function performReplacements(directory, file, depth) {
  const path = `${directory}/${file}`;
  const contents = await readFile(path, 'utf-8')

  await writeFile(
    path,
    contents
      .replaceAll(`from "${sourceDir}/`, `from "${relativeEscapeForDepth(depth)}`)
      .replaceAll(`from '${sourceDir}/`, `from '${relativeEscapeForDepth(depth)}`),
    'utf-8'
  )
}

/**
 * Generate the relative path
 *
 * @param  {Number} depth
 * @return {string}
 */
function relativeEscapeForDepth(depth) {
  if (depth === 1) return './';

  return '../'.repeat(depth - 1);
}
