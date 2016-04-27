var fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer');

module.exports = {

    $data: null,

    init: function() {
        var _this = this;

        _this.$data = _this.getData();
    },

    outputList: function(components, groups) {

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
    },

    getData: function() {
        return JSON.parse(fs.readFileSync('./data.json'));
    },

    saveData: function(callback) {
        var error = false;

        fs.writeFile('data.json', JSON.stringify(this.$data, null, 4), function (err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
            }

            console.log();
            console.log(chalk.green('Pattern library updated successfully!'));

            return callback();
        });

        return ! error;
    },

    createGroupFolder: function(group_path, callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};

        fs.mkdir(group_path, function(err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
                return;
            }

            return callback();
        });
    },

    deleteGroupFolder: function(group) {
        var group_path = 'components/' + group,
            error = false;

        fs.remove(group_path, function(err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
            }
        });

        return ! error;
    },

    createComponentFolder: function(component_path, callback) {
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
    },

    createComponentFiles: function(component) {
        var _this = this,
            group_path = 'components/' + component.group,
            component_path = group_path + '/' + component.name,
            error = false;

        fs.exists(group_path, function(r) {
            if(r) {
                _this.createComponentFolder(component_path);
            } else {
                _this.createGroupFolder(group_path, function() {
                    _this.createComponentFolder(component_path);
                });
            }
        });

        return ! error;
    },

    deleteComponentFiles: function(group_name) {
        var component_path = 'components/' + group_name,
            error = false;

        fs.remove(component_path, function(err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
            }
        });

        return ! error;
    },

    validateComponent: function(group_name) {
        var parts = group_name.split("/");

        // Check format
        if (parts.length !== 2) {
            console.log(chalk.red('Error: A new component name must comprise of a group, a single forward-slash, and a name e.g. buttons/default.'));
            return false;
        }

        // Check for duplication
        if (this.componentExists(group_name)) {
            console.log(chalk.red('Error: A component with the name "%s" already exists in the "%s" group.'), parts[1], parts[0]);
            return false;
        }

        return true;
    },

    componentExists: function(group_name) {
        var parts = group_name.split("/");

        for (var i = 0; i < this.$data.components.length; i++) {
            var c = this.$data.components[i];

            if (c.group == parts[0] && c.name == parts[1]) {
                return i;
            }
        }

        return false;
    },

    groupExists: function(group_name) {
        var parts = group_name.split("/");

        for (var i = 0; i < this.$data.groups.length; i++) {
            var g = this.$data.groups[i];

            if (g.name == parts[0]) {
                return i;
            }
        }

        return false;
    },

    getGroupPositionChoices: function() {
        var choices = [{
                name: 'Position first',
                value: 0
            }],
            n = 1;

        for (var i = 0; i < this.$data.groups.length; i++) {
            var g = this.$data.groups[i];

            choices.push({
                name: 'Position after ' + g.name,
                value: n
            });

            n++;
        }

        return choices;
    },

    getComponentPositionChoices: function(group) {
        var choices = [{
            name: 'Position first',
            value: 0
        }];

        for (var i = 0; i < this.$data.components.length; i++) {
            var c = this.$data.components[i];

            if(c.group == group) {
                choices.push({
                    name: 'Position after ' + c.name,
                    value: i + 1
                });
            }
        }

        return choices;
    },

    getGroupComponentCount: function(group_name) {
        var count = 0;

        for(var i = 0; i < this.$data.components.length; i++) {
            var c = this.$data.components[i];

            if(c.group == group_name) {
                count++;
            }
        }

        return count;
    }
};