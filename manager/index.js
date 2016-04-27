#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

program
    .command('new [group_name]', 'New component.')
    .command('delete [group_name]', 'Delete component.')
    .command('list', 'List components.')
    .parse(process.argv);

// init - Initialise pattern library.
// config - Edit pattern library config.
// edit - Edit component.
// edit --group - Edit group.
