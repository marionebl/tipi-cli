const meow = require('meow');
const entries = require('lodash').entries;
const padEnd = require('lodash/fp').padEnd;
const create = require('./create');
const info = require('./info');
const update = require('./update');

const knownCommands = ['create', 'info', 'update'];
const knownFlags = [
	'cli', 'node', 'description', 'author', 'email', 'name', 'safeName',
	'user', 'year', 'description'
];
const unknownFlags = [];

const cli = meow(`
	Usage
	  $ tipi <command> [options]

	Commands
	  info					- print current user information
	  create <name> - create a new project at ./name
	  update [name] - update current project or at [name]

	Options
	  --cli						Use cli template
	  --node					Use node template (default: true)
	  --author				Full name of author (default: git configuration),
	  --email					E-mail of author (default: git configuration)
	  --name					Name of library (default: [name])
	  --safeName			JS name to use (default camelCase(name)),
	  --user					Github username of auth (default: determined),
	  --year					Year of creation (default: current year),
	  --description		Description to use in meta data

	Examples
	  $ tipi create library
	  # create a node library project at library

	  $ tipi create cli
	  # create a node cli project at cli
`, {
	alias: {
		c: ['cli'],
		d: ['description'],
		h: ['help'],
		n: ['node']
	},
	boolean: ['cli', 'node', 'help'],
	string: ['description', 'author', 'email', 'name', 'safeName', 'user', 'year', 'description'],
	unknown(flag) {
		const isFlag = flag.charAt(0) === '-';
		const isKnownFlag = knownFlags.includes(flag);
		const isKnownUnknown = unknownFlags.includes(flag);
		if (isFlag && !isKnownFlag && !isKnownUnknown) {
			unknownFlags.push(flag);
		}
	}
});

main(cli.input[0], cli.flags, cli.input[1])
	.catch(error => {
		if (error.message === 'managed-error') {
			process.exit(1); // eslint-disable-line xo/no-process-exit
		}
		setTimeout(() => {
			throw error;
		});
	});

function main(command, flags, input) {
	if (command === 'help' || flags.help) {
		cli.showHelp(0);
		return Promise.resolve();
	}

	if (!command) {
		console.error(`<command> parameter is required`);
		cli.showHelp(1);
		return Promise.reject();
	}

	if (!knownCommands.includes(command)) {
		console.error(`unknown <command> ${command}. known commands ${knownCommands.join(', ')}`);
		cli.showHelp(1);
		return Promise.reject();
	}

	if (unknownFlags.length) {
		console.error(`unknown [options] ${unknownFlags.join(', ')}. known options ${knownFlags.join(', ')}`);
		cli.showHelp(1);
		return Promise.reject();
	}

	return new Promise((resolve, reject) => {
		if (command === 'create') {
			return create(input, flags).then(resolve).catch(reject);
		}
		if (command === 'info') {
			return info(input, flags)
				.then((data) => {
					const rows = entries(data).filter(entry => Boolean(entry[1]));
					const labelPad = padEnd(rows.map(row => row[0]).map(i => i.length).reduce((a, b) => a > b ? a : b) + 1);
					rows.forEach(row => {
						console.log(`${labelPad(row[0])} ${row[1]}`);
					});
				})
				.catch(reject);
		}
		if (command === 'update') {
			return update(input, flags).then(resolve).catch(reject);
		}
		console.error(`unknown <command> ${command}. known commands ${knownCommands.join(', ')}`);
		cli.showHelp(1);
	});
}
