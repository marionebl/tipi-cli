const assert = require('assert');
const path = require('path');
const exists = require('path-exists');
const entries = require('lodash').entries;
const ora = require('ora');
const replaceStream = require('replacestream');
const ncp = require('ncp');
const getInfo = require('./info');
const pkg = require('./package');
const cwd = process.cwd();

module.exports = create;

const variants = ['cli', 'node'];

function create(input, flags) {
	assert(input, 'target directory must be specified for <create>');
	const variant = entries(flags).find(entry => variants.includes(entry[0]) && entry[1]) || 'node';
	const sourcePath = path.resolve(__dirname, variant);
	const targetPath = path.resolve(cwd, input);
	const spinner = ora().start();

	const checking = Promise.all([exists(targetPath), getInfo(input, flags)]);

	return Promise.resolve(checking)
		.then(results => {
			const targetExists = results[0];
			if (targetExists) {
				spinner.text = `${targetPath} already exists, aborting <create>`;
				spinner.fail();
				throw new Error(`managed-error`);
			}
			return [targetPath, results[1]];
		})
		.then(results => {
			const info = results[1];
			info['tipi:version'] = pkg.version;
			info['tipi:template'] = variant;
			return [results[0], info];
		})
		.then(results => {
			const targetPath = results[0];
			const info = results[1];
			spinner.text = `encamp ${variant} at ${input}`;
			return copy(sourcePath, targetPath, {
				transform: transform(info)
			});
		})
		.then(() => {
			spinner.text = `encamped ${variant} at ${input}`;
			spinner.succeed();
		})
		.catch(error => {
			spinner.text = error.message;
			spinner.fail();
		});
}

function copy(from, to, options) {
	return new Promise((resolve, reject) => {
		ncp(from, to, options, error => {
			if (error) {
				return reject(error);
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
