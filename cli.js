#!/usr/bin/env node
const meow = require('meow');
const entries = require('lodash').entries;
const padEnd = require('lodash/fp').padEnd;
const includes = require('lodash/fp').includes;
const create = require('./create');
const info = require('./info');

const knownCommands = ['create', 'info', 'update'];
const knownFlags = [
	'author',
	'description',
	'email',
	'name',
	'safeName',
	'template',
	'user',
	'year'
];
const unknownFlags = [];
const isKnownCommmand = flag => includes(flag, knownCommands);
const isKnownFlag = flag => includes(flag, knownFlags);
const isKnownUnknown = flag => includes(flag, unknownFlags);

const cli = meow(`
	Usage
	  $ tipi <command> [options]

	Commands
	  info           - print current user information
	  create <name>  - create a new project at ./name
	  update [name]  - update current project or at [name]

	Options
	  --author       Full name of author (default: git configuration),
	  --cli          Use cli template
	  --description  Description to use in meta data
	  --email        E-mail of author defaults to git configuration.user.email
	  --name         Name of library defaults to [name]
	  --node         Use node template, defaults to true
	  --safeName     JS name to use, defaults to camelCased [name],
		--template     Specify the tipi-template-[template] to use, default to node
	  --user         Github username of author (default: computed),
	  --year         Year of creation (default: current year),

	Examples
	  $ tipi create library
	  # create a node library project at library

	  $ tipi create cli
	  # create a node cli project at cli
`, {
	alias: {
		d: ['description'],
		h: ['help'],
		t: ['template']
	},
	boolean: ['cli', 'node', 'help'],
	string: [
		'author',
		'description',
		'email',
		'name',
		'safeName',
		'template',
		'user',
		'year'
	],
	unknown(flag) {
		const isFlag = flag.charAt(0) === '-';
		if (isFlag && !isKnownFlag(flag) && !isKnownUnknown(flag)) {
			unknownFlags.push(flag);
		}
	}
});

main(cli.input[0], cli.flags, cli.input[1])
	.catch(err => {
		if (!err || err.message === 'managed-error') {
			process.exit(1); // eslint-disable-line xo/no-process-exit
		}
		setTimeout(() => {
			throw err;
		});
	});

function main(command, flags, input) {
	if (command === 'help' || flags.help) {
		cli.showHelp(0);
		return Promise.resolve();
	}

	if (!command) {
		console.log(cli.help);
		console.error(`\n<command> parameter is required`);
		return Promise.reject();
	}

	if (!isKnownCommmand(command)) {
		console.log(cli.help);
		console.error(`\nunknown <command> ${command}. known commands: ${knownCommands.join(', ')}`);
		return Promise.reject();
	}

	if (unknownFlags.length) {
		console.log(cli.help);
		console.error(`\nunknown [options] ${unknownFlags.join(', ')}. known options: ${knownFlags.join(', ')}`);
		return Promise.reject();
	}

	return new Promise((resolve, reject) => {
		if (command === 'create') {
			return create(input, flags).then(resolve).catch(reject);
		}
		if (command === 'info') {
			return info(input, flags)
				.then(data => {
					const rows = entries(data).filter(entry => Boolean(entry[1]));
					const labelPad = padEnd(rows.map(row => row[0]).map(i => i.length).reduce((a, b) => a > b ? a : b) + 1);
					rows.forEach(row => {
						console.log(`${labelPad(row[0])} ${row[1]}`);
					});
				})
				.catch(reject);
		}
		if (command === 'update') {
			console.error('<update> is not implemented yet.');
			process.exit(1);
		}

		console.log(cli.help);
		console.error(`\nunknown <command> ${command}. known commands ${knownCommands.join(', ')}`);
	});
}
