#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

utils.init();

program
    .usage('[group_name/component_name]')
    .description(chalk.yellow('Edit an existing pattern library component or group.'))
    .option('-g, --group [group_name]', 'edit group details');

/**
 * Override argv[1] so that usage command is
 * formatted correctly.
 */
process.argv[1] = 'astrum edit';

program.parse(process.argv);

/**
 * Automatically output help if no parameters are passed.
 */
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

var group_name = program.args[0];
if (group_name) {
    var parts = group_name.split('/'),
        existingComponentIndex = utils.getComponentIndex(group_name),
        existingGroupIndex = utils.getGroupIndex(parts[0]);

    if (existingComponentIndex !== undefined) {
        var component = utils.getComponent(group_name);

        inquirer.prompt([
            {
                name: 'name',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Edit component details:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Component name:'
                },
                validate: function (str) {
                    return utils.validateSlug(str);
                },
                default: component.name
            },
            {
                name: 'title',
                message: 'Component title:',
                validate: function (str) {
                    return utils.validateString(str);
                },
                default: component.title
            },
            {
                when: function () {
                    return !component.type || component.type !== 'colors';
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
                ],
                default: component.width
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
                default: function() {
                    if(component.hasOwnProperty('options') &&
                       component.options.hasOwnProperty('sample_dark_background')) {
                        return component.options.sample_dark_background;
                    }

                    return false;
                }
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
                default: function() {
                    if(component.hasOwnProperty('options') &&
                       component.options.hasOwnProperty('disable_code_sample')) {
                        return component.options.disable_code_sample;
                    }

                    return false;
                }
            },
            {
                type: 'confirm',
                name: 'change_group',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Manage component group association:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Change component group:';
                },
                default: false
            },
            {
                when: function (response) {
                    return response.change_group;
                },
                type: 'list',
                name: 'new_group',
                message: 'Select a new group:',
                choices: utils.getGroupChoices(parts[0])
            },
            {
                when: function (response) {
                    return !response.change_group || response.new_group != 'create_new_group';
                },
                type: 'list',
                name: 'component_position',
                message: function (response) {
                    if (!response.change_group) {
                        return 'Change the position for the component in the "' + component.group + '" group:'
                    } else {
                        return 'Select a position for the component in the "' + response.new_group + '" group:'
                    }
                },
                choices: function (response) {
                    if (!response.change_group) {
                        return utils.getComponentChangePositionChoices(component);
                    } else {
                        return utils.getComponentPositionChoices(response.new_group);
                    }
                },
                default: function (response) {
                    if (!response.change_group) {
                        return utils.getGroupComponentCount(component.group) - 1;
                    }

                    return 0;
                }
            },
            {
                when: function (response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                name: 'group',
                message: function () {
                    console.log();
                    console.log(chalk.grey('New group details:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Group name:';
                },
                validate: function (str) {
                    return utils.validateSlug(str);
                },
                choices: utils.getGroupChoices(parts[0])
            },
            {
                when: function (response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                name: 'group_title',
                message: 'Group title:',
                choices: utils.getGroupChoices()
            },
            {
                when: function (response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                type: 'list',
                name: 'group_position',
                message: 'Select group position:',
                choices: utils.getGroupPositionChoices()
            },
            {
                when: function (response) {
                    return response.change_group && utils.getGroupComponentCount(component.group) == 1;
                },
                type: 'confirm',
                name: 'delete_group',
                message: chalk.red('Moving this component will leave it\'s current parent group empty. Delete the "' + component.group + '" group in the process?'),
                default: true
            }
        ]).then(function (answers) {
            var originalComponent = utils.$data.groups[existingGroupIndex].components[existingComponentIndex],
                editedComponent = {},
                editedGroupIndex,
                error = false;

            // Store edited component details
            editedComponent.name = answers.name;
            editedComponent.title = answers.title;
            if (answers.width != 'full') editedComponent.width = answers.width;

            // Retain original details
            if(originalComponent.type) editedComponent.type = originalComponent.type;
            if(originalComponent.colors) editedComponent.colors = originalComponent.colors;
            if(originalComponent.options) editedComponent.options = originalComponent.options;

            // Apply new options
            if(!answers.sample_dark_background &&
               editedComponent.hasOwnProperty('options') &&
                editedComponent.options.hasOwnProperty('sample_dark_background')) {
                delete editedComponent.options.sample_dark_background;
            }

            if (answers.sample_dark_background) {
                if(!editedComponent.hasOwnProperty('options')) { editedComponent.options = {}; }
                editedComponent.options.sample_dark_background = true;
            }

            if(!answers.disable_code_sample &&
               editedComponent.hasOwnProperty('options') &&
                editedComponent.options.hasOwnProperty('disable_code_sample')) {
                delete editedComponent.options.disable_code_sample;
            }

            if (answers.disable_code_sample) {
                if(!editedComponent.hasOwnProperty('options')) { editedComponent.options = {}; }
                editedComponent.options.disable_code_sample = true;
            }

            //// If creating a new group
            if (answers.new_group == 'create_new_group') {
                var newGroup = {};

                // Store new group details
                newGroup.name = answers.group;
                newGroup.title = answers.group_title;
                newGroup.components = [];

                // Add new group to data
                utils.$data.groups.splice(answers.group_position, 0, newGroup);

                // Set edited components group to new group name
                editedComponent.group = answers.group;
                editedGroupIndex = answers.group_position;

                // Refresh existing groups index
                existingGroupIndex = utils.getGroupIndex(originalComponent.group);
            } else {
                editedComponent.group = answers.new_group ? answers.new_group : originalComponent.group;
                editedGroupIndex = utils.getGroupIndex(editedComponent.group);
            }

            // Check for duplicate data
            if (originalComponent.name != editedComponent.name && utils.componentExists(editedComponent.group + '/' + editedComponent.name)) {
                console.log(chalk.red('Error: A component with same name already exists in the group.'));
                error = true;
            }

            if (!error) {
                // Remove original component in data
                utils.$data.groups[existingGroupIndex].components.splice(existingComponentIndex, 1);
                utils.$data.groups[editedGroupIndex].components.splice(answers.component_position, 0, editedComponent);

                // Move component files
                if (utils.moveComponentFiles(originalComponent, editedComponent)) {

                    if (answers.delete_group) {
                        utils.$data.groups.splice(existingGroupIndex, 1);
                        utils.deleteGroupFolder(originalComponent.group);

                        console.log();
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log(chalk.green('\u2713 Original group deleted successfully.'));
                    }

                    utils.saveData(function () {
                        if (!answers.delete_group) {
                            console.log();
                            console.log(chalk.grey('----------------------------------------------------------------'));
                        }
                        console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log();
                        console.log(chalk.yellow('Edit your component markup in ' + utils.$config.path + '/components/' + editedComponent.group + '/' + editedComponent.name + '/markup.html'));
                        console.log(chalk.yellow('Edit your component description in ' + utils.$config.path + '/components/' + editedComponent.group + '/' + editedComponent.name + '/description.md (Markdown supported)'));
                        console.log();
                    });
                }
            }
        });

        // Return error
    } else {
        console.log(chalk.red('Error: Component not found.'))
    }
}

if (program.group) {
    var existingGroupIndex = utils.getGroupIndex(program.group);

    if (existingGroupIndex !== false) {
        var group = utils.$data.groups[existingGroupIndex];

        inquirer.prompt([
            {
                name: 'name',
                message: function () {
                    console.log();
                    console.log(chalk.grey('Edit group details:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Group name:'
                },
                validate: function (str) {
                    return utils.validateSlug(str);
                },
                default: group.name
            },
            {
                name: 'title',
                message: function () {
                    return 'Group title:'
                },
                validate: function (str) {
                    return utils.validateString(str);
                },
                default: group.title
            },
            {
                type: 'list',
                name: 'group_position',
                message: 'Change the position for the group:',
                choices: utils.getGroupChangePositionChoices(group),
                default: utils.getGroupCount(group) - 1
            }
        ]).then(function (answers) {
            var originalGroup = utils.$data.groups[existingGroupIndex],
                editedGroup = {},
                error = false;

            editedGroup.name = answers.name;
            editedGroup.title = answers.title;
            editedGroup.components = [];

            for (var i = 0; i < originalGroup.components.length; i++) {
                editedGroup.components[i] = originalGroup.components[i];
                editedGroup.components[i].group = answers.name;
            }

            // Check for duplicate data
            if (originalGroup.name != editedGroup.name && utils.groupExists(editedGroup.name)) {
                console.log(chalk.red('Error: Group with same name already exists in.'));
                error = true;
            }

            if (!error) {
                // Remove original group in data
                utils.$data.groups.splice(existingGroupIndex, 1);

                // Add edited group to data
                utils.$data.groups.splice(answers.group_position, 0, editedGroup);

                // Move component files
                if (utils.moveGroupFolder(originalGroup, editedGroup)) {

                    utils.saveData(function () {
                        console.log();
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log(chalk.green('\u2713 Pattern library data saved successfully.'));
                        console.log(chalk.grey('----------------------------------------------------------------'));
                        console.log();

                        if (originalGroup.name != editedGroup.name) {
                            console.log(chalk.yellow('Group components have been moved to ' + utils.$config.path + '/components/' + editedGroup.name));
                            console.log();
                        }
                    });
                }
            }
        });
    } else {
        console.log(chalk.red('Error: Group not found.'));
    }
}
