# tipi

Project scaffolding for the entitled JavaScript developer.

*  Simple
*  Opinionated
*  Best of class tools


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
