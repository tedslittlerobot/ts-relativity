#! /usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { argv } from 'node:process';

const [ sourceDir, destinationDir ] = argv.slice(2);

await replaceFilesInDirectory(destinationDir);

async function replaceFilesInDirectory(directory, depth = 1) {
  (await readdir(directory, { withFileTypes: true }))
    .forEach(async item => {
      if (item.isDirectory()) {
        replaceFilesInDirectory(`${directory}/${item.name}`, depth + 1)

        return;
      }

      if (item.name.endsWith('.js')) {
        await performReplacements(directory, item.name, depth);
      }
    })
}

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

function relativeEscapeForDepth(depth) {
  if (depth === 1) return './';

  return '../'.repeat(depth - 1);
}
