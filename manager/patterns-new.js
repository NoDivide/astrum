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
                message: function() {
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
                name: 'label',
                message: 'Component label (optional):'
            }
        ]).then(function (answers) {
            newComponent.title = answers.title;
            newComponent.label = answers.label ? answers.label : null;

            // If new group prompt for new group details
            if (!utils.groupExists(group_name)) {
                var newGroup = {};
                
                inquirer.prompt([
                    {
                        name: 'title',
                        message: function() {
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
                    newGroup.title = answers.title;;
                    
                    utils.$data.groups.splice(answers.group_position, 0, newGroup);
                    utils.$data.groups[answers.group_position].components = [newComponent];

                    if(utils.createComponentFiles(newComponent)) {
                        utils.saveData(function() {
                            console.log();
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log();
                            console.log(chalk.yellow('Add your component markup to /components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                            console.log(chalk.yellow('Add your component description to /components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                            console.log();
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
                        choices: utils.getComponentPositionChoices(newComponent.group)
                    }
                ]).then(function (answers) {
                    var groupIndex = utils.findGroupIndex(newComponent.group);

                    utils.$data.groups[groupIndex].components.splice(answers.component_position, 0, newComponent);

                    if(utils.createComponentFiles(newComponent)) {
                        utils.saveData(function() {
                            console.log();
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log();
                            console.log(chalk.yellow('Add your component markup to /components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                            console.log(chalk.yellow('Add your component description to /components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                            console.log();
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