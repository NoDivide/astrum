#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

program
    .usage('[command]')
    .command('init', 'initialize new pattern library')
    .command('update', 'update existing pattern library')
    .command('new', 'create a new component')
    .command('edit', 'edit a component and/or group')
    .command('delete', 'delete component and/or group')
    .command('list', 'list components')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
