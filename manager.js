#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer');

var $data = getData();

program
    .option('-n, --new [group/name]', 'New component.')
    .option('-d, --delete [group/name]', 'Delete component.')
    .option('-l, --list', 'List components.')
    .parse(process.argv);

if (program.new) {

    // Validate new component
    if (program.new !== true && validateComponent(program.new)) {

        // Build new component
        var parts = program.new.split("/"),
            newComponent = {};

        newComponent.group = parts[0];
        newComponent.name = parts[1];

        // Prompt for additional component details
        inquirer.prompt([
            {
                name: 'title',
                message: 'Enter a component title:',
                validate: function (str) {
                    return str !== '';
                }
            },
            {
                name: 'label',
                message: 'Add a label to the title? (optional):'
            }
        ]).then(function (answers) {
            newComponent.title = answers.title;
            newComponent.label = answers.label ? answers.label : null;

            // If new group prompt for new group details
            if (!groupExists(program.new)) {
                var newGroup = {};

                inquirer.prompt([
                    {
                        name: 'title',
                        message: 'This component is going in a new group so enter a group title:',
                        validate: function (str) {
                            return str !== '';
                        }
                    },
                    {
                        type: 'list',
                        name: 'group_position',
                        message: 'Select a position for the group in the library:',
                        choices: getGroupPositionChoices()
                    }
                ]).then(function (answers) {
                    newGroup.name = parts[0];
                    newGroup.title = answers.title;

                    $data.groups.splice(answers.group_position, 0, newGroup);
                    $data.components.push(newComponent);

                    if(createComponentFiles(newComponent)) {
                        saveData(function() {
                            console.log(chalk.grey('----------------------------------------------------------------'));
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
                        message: 'Select a position for the component in the "' + newComponent.group + '" group:',
                        choices: getComponentPositionChoices(newComponent.group)
                    }
                ]).then(function (answers) {

                    $data.components.splice(answers.component_position, 0, newComponent);

                    if(createComponentFiles(newComponent)) {
                        saveData(function() {
                            console.log(chalk.grey('----------------------------------------------------------------'));
                            console.log(chalk.yellow('Add your component markup to /components/' + newComponent.group + '/' + newComponent.name + '/markup.html'));
                            console.log(chalk.yellow('Add your component description to /components/' + newComponent.group + '/' + newComponent.name + '/description.md (Markdown supported)'));
                            console.log();
                        });
                    }
                });
            }
        });

    // Return error
    } else if (program.new == true) {
        console.log(chalk.red('Error: To create a new component supply a "group/name" parameter.'))
    }
}

if (program.delete) {
    var parts = program.delete.split('/'),
        componentIndex = componentExists(program.delete),
        groupIndex = groupExists(program.delete);

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
                var componentCount = getGroupComponentCount(parts[0]);

                $data.components.splice(componentIndex, 1);
                deleteComponentFiles(program.delete);

                if(componentCount == 1) {
                    inquirer.prompt([
                        {
                            name: 'deleteGroup',
                            message: chalk.red('Deleting this component will leave it\'s parent group empty. Delete the "' + parts[0] + '" group as well? (yes/no)')
                        }
                    ]).then(function (answers) {

                        if(answers.deleteGroup == 'no') {

                            saveData(function() {
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('Component deleted successfully.'));
                                console.log();
                            });
                        }

                        if(answers.deleteGroup == 'yes') {
                            $data.groups.splice(groupIndex, 1);
                            deleteGroupFolder(parts[0]);

                            saveData(function () {
                                console.log(chalk.grey('----------------------------------------------------------------'));
                                console.log(chalk.green('Group and component deleted successfully.'));
                                console.log();
                            });
                        }
                    });
                } else {

                    saveData(function() {
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

if (program.list) {
    outputList($data.components, $data.groups);
}

function outputList(components, groups) {

    console.log();
    console.log(chalk.grey('Legend:'));
    console.log(chalk.grey('----------------------------------------------------------------'));
    console.log('[i]: index');
    console.log('%s: group', chalk.green('green'));
    console.log('%s: component', chalk.yellow('yellow'));
    console.log(chalk.grey('----------------------------------------------------------------'));
    console.log();

    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];

        console.log('[%s] %s:', i, chalk.green(g.name));

        var k = 0;
        for (var j = 0; j < components.length; j++) {
            var c = components[j];

            if (c.group === g.name) {
                console.log('     %s [%s] %s', String.fromCharCode(0x21B3), k, chalk.yellow(c.name));
                k++;
            }
        }
    }

    console.log();
}

function getData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(callback) {
    var error = false;

    fs.writeFile('data.json', JSON.stringify($data, null, 4), function (err) {
        if (err) {
            console.log(chalk.red('Error: ' + err));
            error = true;
        }

        console.log();
        console.log(chalk.green('Pattern library updated successfully!'));

        return callback();
    });

    return ! error;
}

function createGroupFolder(group_path, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};

    fs.mkdir(group_path, function(err) {
        if (err) {
            console.log(chalk.red('Error: ' + err));
            error = true;
            return;
        }

        return callback();
    });
}

function deleteGroupFolder(group) {
    var group_path = 'components/' + group,
        error = false;

    fs.remove(group_path, function(err) {
        if (err) {
            console.log(chalk.red('Error: ' + err));
            error = true;
        }
    });

    return ! error;
}

function createComponentFolder(component_path, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    var error = false;

    fs.mkdir(component_path, function(err) {
        if (err) {
            console.log(chalk.red('Error: ' + err));
            error = true;
            return;
        }

        fs.writeFile(component_path + '/markup.html', '', function(err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
                return;
            }

            fs.writeFile(component_path + '/description.md', '', function(err) {
                if (err) {
                    console.log(chalk.red('Error: ' + err));
                    error = true;
                    return;
                }

                return callback();
            });
        });
    });

    return ! error;
}

function createComponentFiles(component) {
    var group_path = 'components/' + component.group,
        component_path = group_path + '/' + component.name,
        error = false;

    fs.exists(group_path, function(r) {
        if(r) {
            createComponentFolder(component_path);
        } else {
            createGroupFolder(group_path, function() {
                createComponentFolder(component_path);
            });
        }
    });

    return ! error;
}

function deleteComponentFiles(group_name) {
    var component_path = 'components/' + group_name,
        error = false;

    fs.remove(component_path, function(err) {
        if (err) {
            console.log(chalk.red('Error: ' + err));
            error = true;
        }
    });

    return ! error;
}

function validateComponent(group_name) {
    var parts = group_name.split("/");

    // Check format
    if (parts.length !== 2) {
        console.log(chalk.red('Error: A new component name must comprise of a group, a single forward-slash, and a name e.g. buttons/default.'));
        return false;
    }

    // Check for duplication
    if (componentExists(group_name)) {
        console.log(chalk.red('Error: A component with the name "%s" already exists in the "%s" group.'), parts[1], parts[0]);
        return false;
    }

    return true;
}

function componentExists(group_name) {
    var parts = group_name.split("/");
    
    for (var i = 0; i < $data.components.length; i++) {
        var c = $data.components[i];

        if (c.group == parts[0] && c.name == parts[1]) {
            return i;
        }
    }

    return false;
}

function groupExists(group_name) {
    var parts = group_name.split("/");

    for (var i = 0; i < $data.groups.length; i++) {
        var g = $data.groups[i];

        if (g.name == parts[0]) {
            return i;
        }
    }

    return false;
}

function getGroupPositionChoices() {
    var choices = [{
            name: 'Position first',
            value: 0
        }],
        n = 1;

    for (var i = 0; i < $data.groups.length; i++) {
        var g = $data.groups[i];

        choices.push({
            name: 'Position after ' + g.name,
            value: n
        });

        n++;
    }

    return choices;
}

function getComponentPositionChoices(group) {
    var choices = [{
            name: 'Position first',
            value: 0
        }];

    for (var i = 0; i < $data.components.length; i++) {
        var c = $data.components[i];

        if(c.group == group) {
            choices.push({
                name: 'Position after ' + c.name,
                value: i + 1
            });
        }
    }

    return choices;
}

function getGroupComponentCount(group_name) {
    var count = 0;

    for(var i = 0; i < $data.components.length; i++) {
        var c = $data.components[i];

        if(c.group == group_name) {
            count++;
        }
    }

    return count;
}

// Initialise patterns init
// Edit library details config
// Create component new [name]
// Edit component edit [name]
// Delete component delete [name]
// List components list
