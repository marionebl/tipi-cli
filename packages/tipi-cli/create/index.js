const path = require('path');
const assert = require('assert');
const entries = require('lodash').entries;
const exists = require('path-exists');
const ora = require('ora');
const replaceStream = require('replacestream');
const ncp = require('ncp');
const getInfo = require('../info');
const pkg = require('../package');
const getTemplate = require('./get-template');

module.exports = create;

function create(input, flags) {
	assert(input, 'target directory must be specified for <create>');
	const spinner = ora().start();
	const template = flags.template || 'node';
	const targetPath = path.resolve(process.cwd(), input);

	const checking = Promise.all([
		exists(targetPath),
		getTemplate(flags.template || 'node'),
		getInfo(input, flags)
	]);

	return Promise.resolve(checking)
		.then(results => {
			const targetExists = results[0];
			if (targetExists) {
				const error = new Error(`${targetPath} already exists, aborting <create>`);
				error.managed = true;
				throw error;
			}
			return [results[1], results[2]];
		})
		.then(results => {
			const info = results[1];
			info['tipi:version'] = pkg.version;
			info['tipi:template'] = template;
			return [results[0], info];
		})
		.then(results => {
			const sourcePath = `${results[0]}/`;
			const info = results[1];
			spinner.text = `encamp ${template} at ${input}`;
			console.log({sourcePath, targetPath});
			return copy(sourcePath, targetPath, {
				transform: transform(info)
			});
		})
		.then(() => {
			spinner.text = `encamped ${template} at ${input}`;
			spinner.succeed();
		})
		.catch(err => {
			if (err.managed) {
				spinner.text = err.message;
				spinner.fail();
			}
			throw err;
		});
}

function copy(from, to, options) {
	return new Promise((resolve, reject) => {
		ncp(from, to, options, err => {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}

function transform(info) {
	return (read, write) => {
		const replacements = entries(info);
		const replacing = replacements
			.reduce((stream, replacement) => {
				const key = replacement[0];
				const value = replacement[1];
				return stream.pipe(replaceStream('${' + key + '}', value));
			}, read);

		replacing.pipe(write);
	};
}
