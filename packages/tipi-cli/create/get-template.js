const os = require('os');
const path = require('path');
const packageJson = require('package-json');
const npa = require('npm-package-arg');
const npdl = require('npmdl');
const values = require('lodash').values;
const semver = require('semver');

module.exports = getTemplate;

function getTemplate(name) {
	const templateName = `tipi-template-${name}`;
	const parsed = npa(templateName);

	if (!parsed.type === 'range') {
		return Promise.reject(new Error(`only templates hosted on npmjs.org are supported.`));
	}

	return Promise.resolve(packageJson(parsed.name))
		.then(getMatchingVersionManifest(parsed))
		.then(getPackageArchive(parsed.name));
}

function getMatchingVersionManifest(parsed) {
	return pkg => {
		if (parsed.spec in pkg['dist-tags']) {
			const version = pkg['dist-tags'][parsed.spec];
			return pkg.versions[version];
		}
		const matching = values(pkg.versions)
			.filter(entry => semver.satisfies(entry.version, parsed.spec))
			.sort((a, b) => semver.gt(a.version, b.version) ? a : b);

		if (!matching.length) {
			throw new Error(`${parsed.name} has no versions satisfying ${parsed.spec}. Available: ${Object.keys(matching).join(', ')}`);
		}

		return matching[0];
	};
}

function getPackageArchive(name) {
	return manifest => {
		return downloadPackage(name, manifest.version);
	};
}

function downloadPackage(name, version) {
	return new Promise((resolve, reject) => {
		const dir = path.resolve(os.tmpdir());
		const result = path.resolve(dir, name, version, 'package', 'template');
		const manifestPath = path.join('template', 'package.json');

		npdl(dir)(name, version, manifestPath, err => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}
