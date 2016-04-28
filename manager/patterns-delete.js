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
        groupIndex = utils.getGroupIndex(parts[0]);

    if(componentIndex !== false) {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'delete',
                message: function() {
                    console.log();
                    console.log(chalk.grey('Delete "' + parts[1] + '" component:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return chalk.red('Are you sure you want to delete this component?');
                },
                default: false
            }
        ]).then(function (answers) {
            if(!answers.delete) {
                console.log();
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log(chalk.green('\u2713 Deletion cancelled.'));
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log();
                return;
            }

            if(answers.delete) {
                var componentCount = utils.getGroupComponentCount(parts[0]);

                utils.$data.groups[groupIndex].components.splice(componentIndex, 1);
                utils.deleteComponentFiles(group_name);

                if(componentCount == 1) {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'delete_group',
                            message: chalk.red('Deleting this component will leave it\'s parent group empty. Delete the "' + parts[0] + '" group as well?'),
                            default: true
                        }
                    ]).then(function (answers) {

                        if(!answers.delete_group) {

                            utils.saveData(function() {
                                console.log();
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('\u2713 Component deleted successfully.'));
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log();
                            });
                        }

                        if(answers.delete_group) {
                            utils.$data.groups.splice(groupIndex, 1);
                            utils.deleteGroupFolder(parts[0]);

                            utils.saveData(function () {
                                console.log();
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('\u2713 Group and component deleted successfully.'));
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log();
                            });
                        }
                    });
                } else {

                    utils.saveData(function() {
                        console.log();
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log(chalk.green('\u2713 Component deleted successfully.'));
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log();
                    });
                }
            }
        });
    } else {
        console.log(chalk.red('Error: Component does not exist.'));
    }
}