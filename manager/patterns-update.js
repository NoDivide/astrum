#!/usr/bin/env node
var Command = require('commander').Command,
    program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

utils.init();


var pjson = require('../package.json'),
    djson = require('../../..' + utils.$config.path + '/data.json');

program
    .usage('[path]')
    .description(chalk.yellow('Update an existing pattern library.'));

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'patterns update';

program.parse(process.argv);

/**
 * Automatically output help if no parameters are passed.
 */
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

/**
 * Update pattern library.
 */
var path = program.args[0];
if(path) {
    utils.update(path, function () {
        console.log();
        console.log(chalk.grey('----------------------------------------------------------------'));
        console.log(chalk.green('\u2713 Pattern library successfully updated from ' + djson.version + ' to ' + pjson.version + '.'));
        console.log(chalk.grey('----------------------------------------------------------------'));
        console.log();
    });
}