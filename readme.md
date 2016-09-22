> Project scaffolding for the entitled JavaScript developer.

# tipi [![stability][0]][1]

[![npm version][6]][7] [![Travis branch][2]][3] [![AppVeyor branch][4]][5]

*  :rocket: Dead simple
*  :heart: No choices, no fatigue
*  :tada: Best of class tools


## Installation

Grab it from npm

```shell
npm install --global tipi-cli
```

## Usage

```
tipi-cli --help
Project scaffolding for the entitled JavaScript developer

  Usage
    $ tipi <command> [options]

  Commands
    info           - print current user information
    create <name>  - create a new project at ./name
    update [name]  - update current project or at [name]

  Options
    --cli          Use cli template
    --node         Use node template (default: true)
    --author       Full name of author (default: git configuration),
    --email        E-mail of author (default: git configuration)
    --name         Name of library (default: [name])
    --safeName     JS name to use (default camelCase(name)),
    --user         Github username of auth (default: determined),
    --year         Year of creation (default: current year),
    --description  Description to use in meta data

  Examples
    $ tipi create library
    # create a node library project at library

    $ tipi create cli
    # create a node cli project at cli
```

## Templates

`tipi-cli` uses npm-published [templates][8] for scaffolding.
Templates maintainted by the core project are:

* [cli](packages/cli)   - generic cli project template
* [node](packages/node) - generic node project template

---
Built by (c) Mario Nebl. Released under the MIT license.

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/travis/marionebl/tipi-cli/master.svg?style=flat-square
[3]: https://travis-ci.org/marionebl/tipi-cli
[4]: https://img.shields.io/appveyor/ci/marionebl/tipi-cli/master.svg?style=flat-square
[5]: https://ci.appveyor.com/project/marionebl/tipi-cli
[6]: https://img.shields.io/npm/v/tipi-cli.svg?style=flat-square
[7]: https://npmjs.org/package/tipi-cli
[8]: https://www.npmjs.com/search?q=tipi-template
