#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils'),
    pjson = require('../package.json');

program
    .version(pjson.version)
    .usage('[command]')
    .command('init', 'initialize new pattern library')
    .command('update', 'update existing pattern library')
    .command('new', 'create a new component')
    .command('edit', 'edit a component and/or group')
    .command('delete', 'delete component and/or group')
    .command('list', 'list components')
    .option('-I, --instance', 'output the instance version number')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

/**
 * Get instance version number.
 */
if (program.instance) {
    try {
        if(utils.getConfig()) {
            utils.init();
            console.log(chalk.grey("This Astrum instance version is: ") + chalk.green(utils.$data.version));
        }
    } catch (e) {
        console.log(chalk.red("Astrum has not been initialised."));
    }
}