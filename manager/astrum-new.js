#!/usr/bin/env node
var Command = require('commander').Command,
    program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

utils.init();

program
    .usage('[group_name/component_name]')
    .description(chalk.yellow('Create a new pattern library component.'))
    .option('-t, --type [name]', 'set component type: (standard|colors). Default standard.');

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'astrum new';

program.parse(process.argv);


/**
 * Automatically output help if no parameters are passed.
 */
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

/**
 * Create new component
 */
var group_name = program.args[0];
if (group_name) {

    if (group_name !== true && utils.validateComponent(group_name)) {

        // Build new component
        var parts = group_name.split("/"),
            newComponent = {};

        newComponent.group = parts[0];
        newComponent.name = parts[1];

        // Prompt for additional component details
        inquirer.prompt([
            {
                name: 'title',
                message: function () {
                    console.log();
                    console.log(chalk.grey('New component details:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    console.log(chalk.grey('Component group: ' + parts[0]));
                    console.log(chalk.grey('Component name: ' + parts[1]));
                    return 'Component title:'
                },
                validate: function (str) {
                    return str !== '';
                }
            },
            {
                when: function () {
                    return !program.type || program.type !== 'colors';
                },
                type: 'list',
                name: 'width',
                message: function () {
                    return 'Component width:'
                },
                choices: [
                    {
                        name: 'Full width',
                        value: 'full'
                    },
                    {
                        name: 'Half width',
                        value: 'half'
                    }
                ]
            },
            {
                when: function () {
                    return !program.type || program.type !== 'colors';
                },
                type: 'confirm',
                name: 'sample_dark_background',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Component options:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Apply a dark background to the code sample?'
                },
                default: false
            },
            {
                when: function () {
                    return !program.type || program.type !== 'colors';
                },
                type: 'confirm',
                name: 'disable_code_sample',
                message: function () {
                    return 'Disable code sample?'
                },
                default: false
            }
        ]).then(function (answers) {
            var typeColor = program.type && program.type == 'colors';

            newComponent.title = answers.title;
            if (answers.width != 'full') newComponent.width = answers.width;

            if (answers.sample_dark_background) {
                if(!newComponent.hasOwnProperty('options')) { newComponent.options = {} };
                newComponent.options.sample_dark_background = answers.sample_dark_background;
            }

            if (answers.disable_code_sample) {
                if(!newComponent.hasOwnProperty('options')) { newComponent.options = {} };
                newComponent.options.disable_code_sample = answers.disable_code_sample;
            }

            if (typeColor) {
                newComponent.type = 'colors';
                newComponent.colors = [];
            }

            // If new group prompt for new group details
            if (!utils.groupExists(group_name)) {
                var newGroup = {};

                inquirer.prompt([
                    {
                        name: 'title',
                        message: function () {
                            console.log();
                            console.log(chalk.grey('New group details:'));
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.grey('Group name: ' + parts[0]));
                            return 'Group title:';
                        },
                        validate: function (str) {
                            return str !== '';
                        }
                    },
                    {
                        type: 'list',
                        name: 'group_position',
                        message: 'Select group position:',
                        choices: utils.getGroupPositionChoices()
                    }
                ]).then(function (answers) {
                    newGroup.name = parts[0];
                    newGroup.title = answers.title;

                    utils.$data.groups.splice(answers.group_position, 0, newGroup);
                    utils.$data.groups[answers.group_position].components = [newComponent];

                    if (utils.createComponentFiles(newComponent)) {
                        utils.saveData(function () {
                            console.log();
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                            console.log(chalk.grey('----------------------------------------------------------------'));

                            if (typeColor) {
                                console.log();
                                console.log(chalk.yellow('Ignore ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                                console.log(chalk.yellow('Add your component description to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                                console.log();
                                console.log(chalk.yellow('Locate this component in your data.json file and add your colors to the "colors"'));
                                console.log(chalk.yellow('array that has been created for you. Colors must be hex values e.g.:'));
                                console.log();
                                console.log(chalk.yellow('"colors": ['));
                                console.log(chalk.yellow('    "#4c4c4c",'));
                                console.log(chalk.yellow('    "#7d8284",'));
                                console.log(chalk.yellow('    "#a6b1b5",'));
                                console.log(chalk.yellow('    "#e6eaf2",'));
                                console.log(chalk.yellow('    "#FFFFFF"'));
                                console.log(chalk.yellow(']'));
                                console.log();
                                console.log(chalk.yellow('You can also add complimentary colors by comma separating the values e.g.:'));
                                console.log();
                                console.log(chalk.yellow('"colors": ['));
                                console.log(chalk.yellow('    "#7da9f9,#507ed3",'));
                                console.log(chalk.yellow('    "#f469a7,#c14c80",'));
                                console.log(chalk.yellow('    "#60ceb8,#3fa18d",'));
                                console.log(chalk.yellow('    "#f5d13f,#f5a63f",'));
                                console.log(chalk.yellow('    "#e199e5,#c776cb"'));
                                console.log(chalk.yellow(']'));
                                console.log();
                            } else {
                                console.log();
                                console.log(chalk.yellow('Add your group description to ' + utils.$config.path + '/components/' + newComponent.group + '/description.md (Markdown supported)'));
                                console.log(chalk.yellow('Add your component markup to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                                console.log(chalk.yellow('Add your component description to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                                console.log();
                            }
                        });
                    }
                });

                // Else prompt to position new component in group
            } else {

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'component_position',
                        message: 'Select component position in the "' + newComponent.group + '" group:',
                        choices: utils.getComponentPositionChoices(newComponent.group),
                        default: utils.getComponentPositionChoices(newComponent.group).length - 1
                    }
                ]).then(function (answers) {
                    var groupIndex = utils.getGroupIndex(newComponent.group);

                    utils.$data.groups[groupIndex].components.splice(answers.component_position, 0, newComponent);

                    if (utils.createComponentFiles(newComponent)) {
                        utils.saveData(function () {
                            console.log();
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                            console.log(chalk.grey('----------------------------------------------------------------'));

                            if (typeColor) {
                                console.log();
                                console.log(chalk.yellow('Ignore ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                                console.log(chalk.yellow('Add your component description to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                                console.log();
                                console.log(chalk.yellow('Locate this component in your data.json file and add your colors to the "colors"'));
                                console.log(chalk.yellow('array that has been created for you. Colors must be hex values e.g.:'));
                                console.log();
                                console.log(chalk.yellow('"colors": ['));
                                console.log(chalk.yellow('    "#4c4c4c",'));
                                console.log(chalk.yellow('    "#7d8284",'));
                                console.log(chalk.yellow('    "#a6b1b5",'));
                                console.log(chalk.yellow('    "#e6eaf2",'));
                                console.log(chalk.yellow('    "#FFFFFF"'));
                                console.log(chalk.yellow(']'));
                                console.log();
                                console.log(chalk.yellow('You can also add complimentary colors by comma separating the values e.g.:'));
                                console.log();
                                console.log(chalk.yellow('"colors": ['));
                                console.log(chalk.yellow('    "#7da9f9,#507ed3",'));
                                console.log(chalk.yellow('    "#f469a7,#c14c80",'));
                                console.log(chalk.yellow('    "#60ceb8,#3fa18d",'));
                                console.log(chalk.yellow('    "#f5d13f,#f5a63f",'));
                                console.log(chalk.yellow('    "#e199e5,#c776cb"'));
                                console.log(chalk.yellow(']'));
                                console.log();
                            } else {
                                console.log();
                                console.log(chalk.yellow('Add your component markup to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                                console.log(chalk.yellow('Add your component description to ' + utils.$config.path + '/components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                                console.log();
                            }
                        });
                    }
                });
            }
        });

        // Return error
    } else if (group_name == true) {
        console.log(chalk.red('Error: To create a new component supply a "group/name" parameter.'))
    }
}
