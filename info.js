const getFullName = require('git-username');
const getEmail = require('git-user-email');
const getUser = require('github-username');
const camelCase = require('lodash').camelCase;
const merge = require('lodash').merge;

module.exports = info;

function info(name, flags) {
	const author = getFullName();
	const email = getEmail();
	const safeName = camelCase(name);

	const explicit = {
		author: flags.author,
		email: flags.email,
		name: flags.name,
		safeName: flags.safeName,
		user: flags.user,
		year: flags.year,
		description: flags.description
	};

	const determine = explicit.user ?
		Promise.resolve(explicit.user) :
		getUser(email);

	return determine
		.then(user => {
			return merge({
				author: author || user,
				email: email,
				name: name,
				safeName: safeName,
				user: user,
				year: new Date().getFullYear()
			}, explicit);
		})
		.catch(() => {
			throw new Error('Could not determine GitHub username. Please specify explicitly via --user');
		});
}
