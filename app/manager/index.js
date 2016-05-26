#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

program
    .version('1.1.0')
    .usage('[command]')
    .command('new', 'create a new component')
    .command('edit', 'edit a component and/or group')
    .command('delete', 'delete component and/or group')
    .command('list', 'list components')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
