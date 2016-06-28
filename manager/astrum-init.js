#!/usr/bin/env node
var Command = require('commander').Command,
    program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

program
    .usage('[path]')
    .description(chalk.yellow('Initilize a new pattern library.'));

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'patterns init';

program.parse(process.argv);


/**
 * Automatically output help if no parameters are passed.
 */
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

/**
 * Initialize pattern library.
 */
var path = program.args[0];
if(path) {
    utils.setup(path, function() {
        console.log();
        console.log(chalk.grey('----------------------------------------------------------------'));
        console.log(chalk.green('\u2713 Pattern library initialized successfully.'));
        console.log(chalk.grey('----------------------------------------------------------------'));
        console.log();
        console.log(chalk.yellow('To get started add your first component using:'));
        console.log();
        console.log(chalk.yellow('$ astrum new [group_name/component_name]'));
        console.log();
        console.log(chalk.yellow('To customise your pattern library locate your data.json file'));
        console.log(chalk.yellow('in ' + path + ' and add your project details.'));
        console.log();
    });
}