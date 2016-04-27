#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

utils.init();

program
    .parse(process.argv);

var group_name = program.args[0];
if (group_name) {
    var parts = group_name.split('/'),
        componentIndex = utils.componentExists(group_name),
        groupIndex = utils.groupExists(group_name);

    if(componentIndex !== false) {
        inquirer.prompt([
            {
                name: 'delete',
                message: chalk.red('Are you sure you want to permanently delete the "' + parts[1] + '" component? (yes/no)')
            }
        ]).then(function (answers) {
            if(answers.delete == 'no') {
                console.log();
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log(chalk.yellow('Deletion cancelled.'));
                console.log();
                return;
            }

            if(answers.delete == 'yes') {
                var componentCount = utils.getGroupComponentCount(parts[0]);

                utils.$data.components.splice(componentIndex, 1);
                utils.deleteComponentFiles(group_name);

                if(componentCount == 1) {
                    inquirer.prompt([
                        {
                            name: 'deleteGroup',
                            message: chalk.red('Deleting this component will leave it\'s parent group empty. Delete the "' + parts[0] + '" group as well? (yes/no)')
                        }
                    ]).then(function (answers) {

                        if(answers.deleteGroup == 'no') {

                            utils.saveData(function() {
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('Component deleted successfully.'));
                                console.log();
                            });
                        }

                        if(answers.deleteGroup == 'yes') {
                            utils.$data.groups.splice(groupIndex, 1);
                            utils.deleteGroupFolder(parts[0]);

                            utils.saveData(function () {
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('Group and component deleted successfully.'));
                                console.log();
                            });
                        }
                    });
                } else {

                    utils.saveData(function() {
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log(chalk.green('Component deleted successfully.'));
                        console.log();
                    });
                }
            }
        });
    } else {
        console.log(chalk.red('Error: Component does not exist.'));
    }
}