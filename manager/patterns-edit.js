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
        existingComponentIndex = utils.componentExists(group_name),
        existingGroupIndex = utils.getGroupIndex(parts[0]);

    if (existingComponentIndex !== false) {
        var component = utils.getComponent(group_name);

        inquirer.prompt([
            {
                name: 'name',
                message: function() {
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
                name: 'label',
                message: 'Component label (optional):',
                default: component.label
            },
            {
                type: 'confirm',
                name: 'change_group',
                message: function() {
                    console.log();
                    console.log(chalk.grey('Manage component group association:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Change component group:';
                },
                default: false
            },
            {
                when: function(response) {
                    return response.change_group;
                },
                type: 'list',
                name: 'new_group',
                message: 'Select a new group:',
                choices: utils.getGroupChoices(parts[0])
            },
            {
                when: function(response) {
                    return ! response.change_group || response.new_group != 'create_new_group';
                },
                type: 'list',
                name: 'component_position',
                message: function(response) {
                    if(! response.change_group) {
                        return 'Change the position for the component in the "' + component.group + '" group:'
                    } else {
                        return 'Select a position for the component in the "' + response.new_group + '" group:'
                    }
                },
                choices: function(response) {
                    if(! response.change_group) {
                        return utils.getComponentChangePositionChoices(component);
                    } else {
                        return utils.getComponentPositionChoices(response.new_group);
                    }
                },
                default: function(response) {
                    if(! response.change_group) {
                        return utils.getGroupComponentCount(component.group) - 1;
                    }

                    return 0;
                }
            },
            {
                when: function(response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                name: 'group',
                message: function() {
                    console.log();
                    console.log(chalk.grey('New group details:'));
                    console.log(chalk.grey('----------------------------------------------------------------'));
                    return 'Group name:';
                },
                choices: utils.getGroupChoices(parts[0])
            },
            {
                when: function(response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                name: 'group_title',
                message: 'Group title:',
                choices: utils.getGroupChoices()
            },
            {
                when: function(response) {
                    return response.change_group && response.new_group == 'create_new_group';
                },
                type: 'list',
                name: 'group_position',
                message: 'Select group position:',
                choices: utils.getGroupPositionChoices()
            },
            {
                when: function(response) {
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
            editedComponent.name  = answers.name;
            editedComponent.title = answers.title;
            editedComponent.label = answers.label ? answers.label : null;

            //// If creating a new group
            if(answers.new_group == 'create_new_group') {
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
                
            // Else set edited components group to existing group name
            } else {
                editedComponent.group = answers.new_group ? answers.new_group : originalComponent.group;
                editedGroupIndex = utils.getGroupIndex(editedComponent.group);
            }

            // Check for duplicate data
            if(originalComponent.group != editedComponent.group && utils.componentExists(editedComponent.group + '/' + editedComponent.name) == false) {
                console.log(chalk.red('Error: Component with same name already exists in group.'));
                error = true;
            }

            if(!error) {
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
                        console.log(chalk.yellow('Edit your component markup in /components/' + editedComponent.group + '/' + editedComponent.name + '/markup.html'));
                        console.log(chalk.yellow('Edit your component description in /components/' + editedComponent.group + '/' + editedComponent.name + '/description.md (Markdown supported)'));
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