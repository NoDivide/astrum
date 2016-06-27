#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

utils.init();

program
    .description(chalk.yellow('Delete a pattern library component or group.'))
    .option('-g, --group [group_name]', 'delete group');

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'astrum delete';

program.parse(process.argv);

/**
 * Automatically output help if no parameters are passed.
 */
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

/**
 * Delete individual component.
 */
var group_name = program.args[0];
if (group_name) {
    var parts = group_name.split('/');

    if (utils.componentExists(group_name) !== false) {
        var componentIndex = utils.getComponentIndex(group_name),
            groupIndex = utils.getGroupIndex(parts[0]);

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'delete',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Delete "' + parts[1] + '" component:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return chalk.red('Are you sure you want to delete this component?');
                },
                default: false
            }
        ]).then(function (answers) {
            if (!answers.delete) {
                console.log();
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log(chalk.green('\u2713 Deletion cancelled.'));
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log();
                return;
            }

            if (answers.delete) {
                var componentCount = utils.getGroupComponentCount(parts[0]);

                utils.$data.groups[groupIndex].components.splice(componentIndex, 1);
                utils.deleteComponentFiles(group_name);

                if (componentCount == 1) {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'delete_group',
                            message: chalk.red('Deleting this component will leave it\'s parent group empty. Delete the "' + parts[0] + '" group as well?'),
                            default: true
                        }
                    ]).then(function (answers) {

                        if (!answers.delete_group) {

                            utils.saveData(function () {
                                console.log();
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('\u2713 Component deleted successfully.'));
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log();
                            });
                        }

                        if (answers.delete_group) {
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

                    utils.saveData(function () {
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
        console.log(chalk.red('Error: Component not found.'));
    }
}

/**
 * Delete entire group.
 */
if (program.group) {
    var existingGroupIndex = utils.getGroupIndex(program.group);

    if (existingGroupIndex !== -1) {
        var group = utils.$data.groups[existingGroupIndex];

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'delete',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Delete the "' + group.name + '" group and all it\'s components:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return chalk.red('Are you sure you want to delete this group?');
                },
                default: false
            }
        ]).then(function (answers) {
            if (!answers.delete) {
                console.log();
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log(chalk.green('\u2713 Deletion cancelled.'));
                console.log(chalk.grey('----------------------------------------------------------------'));
                console.log();
                return;
            }

            if (answers.delete) {
                utils.$data.groups.splice(existingGroupIndex, 1);
                utils.deleteGroupFolder(group.name);

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
        console.log(chalk.red('Error: Group not found.'));
    }
}