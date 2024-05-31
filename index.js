#! /usr/bin/env node

import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {argv, env} from 'node:process';

const [sourceDirectory, destinationDirectory] = argv.slice(2);

replaceFilesInDirectory(destinationDirectory);

/// /////////////////////////////////////////////////////////////////////////////
///       Helpers                                                            ///
/// /////////////////////////////////////////////////////////////////////////////

/**
 * Recursively replace with relative imports in a given directory
 *
 * @param  {string} directory The directory to scan in
 * @param  {Number} depth     A marker to store the depth level we are currently in
 * @return Promise<void>
 */
function replaceFilesInDirectory(directory, depth = 1) {
	readdirSync(directory, {withFileTypes: true})
		.map(async item => {
			if (item.isDirectory()) {
				replaceFilesInDirectory(`${directory}/${item.name}`, depth + 1);

				return;
			}

			if (item.name.endsWith('.js')) {
				performReplacements(directory, item.name, depth);
			}
		});
}

/**
 * Perform the replacements in a given file
 *
 * @param  {string} directory
 * @param  {string} file
 * @param  {Number} depth
 * @return Promise<void>
 */
function performReplacements(directory, file, depth) {
	const path = `${directory}/${file}`;
	const contents = readFileSync(path, 'utf8');

	log(`Found file ${path}, contents size: ${contents.length}`);

	if (contents.length === 0) {
		log(`Ignoring empty file ${path}`);
		return;
	}

	const replacements = contents
		.replaceAll(`from "${sourceDirectory}/`, `from "${relativeEscapeForDepth(depth)}`)
		.replaceAll(`from '${sourceDirectory}/`, `from '${relativeEscapeForDepth(depth)}`);

	log(`Replaced ${path}, replaced size: ${replacements.length}`);

	writeFileSync(
		path,
		replacements,
		'utf8',
	);

	log(`Wriiten file ${path}`);
}

/**
 * Generate the relative path
 *
 * @param  {Number} depth
 * @return {string}
 */
function relativeEscapeForDepth(depth) {
	if (depth === 1) {
		return './';
	}

	return '../'.repeat(depth - 1);
}

function log(message) {
	if (env.VERBOSE) {
		console.info(message);
	}
}
