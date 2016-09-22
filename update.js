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

	return getUser(email)
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
			return merge({
				author: null,
				email: email,
				name: name,
				safeName: safeName,
				user: null,
				year: new Date().getFullYear()
			}, explicit);
		});
}
