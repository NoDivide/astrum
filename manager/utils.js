var fs = require('fs-extra'),
    chalk = require('chalk'),
    inquirer = require('inquirer'),
    pjson = require('../package.json');

module.exports = {

    $config: null,
    $data: null,
    $pjson: pjson,

    init: function() {
        var _this = this;

        // Get config.
        try {
            _this.$config = _this.getConfig();
        } catch (e) {
            throw(new Error(chalk.red("No astrum-config.json file found in project root.")));
        }

        // Get data.
        try {
            _this.$data = _this.getData();
        } catch (e) {
            throw(new Error(chalk.red("No data.json file found in " + _this.$config.path )));
        }
    },

    setup: function(path, callback) {
        var _this = this,
            error = false;

        fs.exists(path, function(r) {
            if (r) {
                throw(new Error(chalk.red('Pattern library has already been initialized.')));
            }
        });

        fs.copy('./_template', path, function (err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
            }

            _this.init();
            _this.updateVersion(pjson.version);

            return callback();
        });

        return ! error;
    },

    updateVersion: function(number) {
        this.$data.version = number;

        this.saveData(function(){});
    },

    update: function(path, callback) {
        var _this = this;

        fs.exists(path, function(r) {
            if (!r) {
                throw(new Error(chalk.red('No pattern library found to update.')));
            }
        });

        fs.copy('./_template/app', path + '/app');
        fs.copy('./_template/index.html', path + '/index.html');
        fs.copy('./_template/LICENSE.txt', path + '/LICENSE.txt');

        _this.updateVersion(pjson.version);

        return callback();
    },

    getConfig: function() {
        return JSON.parse(fs.readFileSync('../../patterns-config.json'));
    },

    getData: function() {
        return JSON.parse(fs.readFileSync(this.$config.path + '/data.json'));
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

        if(groups.length) {
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];

                console.log('[%s] %s:', i, chalk.green(g.name));

                var k = 0;
                for (var j = 0; j < groups[i].components.length; j++) {
                    var c = groups[i].components[j];

                    if (c.group === g.name) {
                        console.log('     %s [%s] %s', String.fromCharCode(0x21B3), k, chalk.yellow(c.name));
                        k++;
                    }
                }
            }
        } else {
            console.log('Your pattern library is empty.');
        }

        console.log();
    },



    saveData: function(callback) {
        var error = false;

        fs.writeFile(this.$config.path + '/data.json', JSON.stringify(this.$data, null, 4), function (err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
            }

            return callback();
        });

        return ! error;
    },

    getGroupIndex: function(group) {
        return this.$data.groups.findIndex(function(item) {
            return item.name == group;
        });
    },

    getComponentIndex: function(group_name) {
        var _this = this,
            parts = group_name.split("/"),
            groupIndex = _this.getGroupIndex(parts[0]);

        if (groupIndex !== -1) {
            for (var i = 0; i < _this.$data.groups[groupIndex].components.length; i++) {
                var c = _this.$data.groups[groupIndex].components[i];

                if (c.name == parts[1]) {
                    return i;
                }
            }
        }
    },

    createGroupFolder: function(group_path, callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};

        fs.mkdir(group_path, function(err) {
            if (err) {
                console.log(chalk.red('Error: ' + err));
                error = true;
                return;
            }

            fs.writeFile(group_path + '/description.md', '', function(err) {
                if (err) {
                    console.log(chalk.red('Error: ' + err));
                    error = true;
                    return;
                }
            });

            return callback();
        });
    },

    deleteGroupFolder: function(group) {
        var group_path = this.$config.path + '/components/' + group,
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
            group_path = this.$config.path + '/components/' + component.group,
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

    moveComponentFiles: function(original_component, edited_component) {
        var oPath = this.$config.path + '/components/' + original_component.group + '/' + original_component.name,
            dPath = this.$config.path + '/components/' + edited_component.group + '/' + edited_component.name,
            error = false;

        if(oPath != dPath) {
            fs.move(oPath, dPath, function(err) {
                if (err) {
                    console.error(chalk.red('Error: ' + err));
                    error = true;
                }
            });
        }

        return ! error;
    },

    moveGroupFolder: function(original_group, edited_group) {
        var oPath = this.$config.path + '/components/' + original_group.name,
            dPath = this.$config.path + '/components/' + edited_group.name,
            error = false;

        if(oPath != dPath) {
            fs.move(oPath, dPath, function(err) {
                if (err) {
                    console.error(chalk.red('Error: ' + err));
                    error = true;
                }
            });
        }

        return ! error;
    },

    deleteComponentFiles: function(group_name) {
        var component_path = this.$config.path + '/components/' + group_name,
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
        var _this = this,
            parts = group_name.split("/"),
            groupIndex = _this.getGroupIndex(parts[0]);

        if (groupIndex !== -1) {
            for (var i = 0; i < _this.$data.groups[groupIndex].components.length; i++) {
                var c = _this.$data.groups[groupIndex].components[i];

                if (c.name == parts[1]) {
                    return true;
                }
            }
        }

        return false;
    },

    groupExists: function(group_name) {
        var parts = group_name.split("/");

        return this.getGroupIndex(parts[0]) == -1 ? false : true;
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

    getGroupChoices: function(exclude_group) {
        exclude_group = typeof exclude_group !== 'undefined' ? exclude_group : null;

        var choices = [];

        for (var i = 0; i < this.$data.groups.length; i++) {
            var g = this.$data.groups[i];

            if(exclude_group != g.name) {
                choices.push({
                    name: g.name,
                    value: g.name
                });
            }
        }

        choices.push(new inquirer.Separator());

        choices.push({
            name: 'Create a new group...',
            value: 'create_new_group'
        });

        return choices;
    },

    getComponentChangePositionChoices: function(component) {
        var _this = this,
            choices = [],
            message,
            currentPosition = null,
            groupIndex = _this.getGroupIndex(component.group),
            first = true,
            passedCurrentPosition = false;

        for (var i = 0; i < _this.$data.groups[groupIndex].components.length; i++) {
            var c = _this.$data.groups[groupIndex].components[i];

            if(first && c.name != component.name) {
                choices.push({
                    name: 'Position first',
                    value: 0
                });
            }
            first = false;

            if(c.name == component.name) {
                if(i != 0) choices.pop();
                currentPosition = i;
                passedCurrentPosition = true;
            }

            if(c.name != component.name) {
                choices.push({
                    name: 'Position after ' + chalk.yellow(c.name),
                    value: passedCurrentPosition ? i : i + 1
                });
            }
        }

        choices.push(new inquirer.Separator());

        message = currentPosition == 0 ? 'Keep current first position' : 'Keep current position after ' + chalk.yellow(_this.$data.groups[groupIndex].components[currentPosition - 1].name);

        choices.push({
            name: message,
            value: currentPosition
        });

        return choices;
    },

    getGroupChangePositionChoices: function(group) {
        var _this = this,
            choices = [],
            message,
            currentPosition = null,
            groupIndex = _this.getGroupIndex(group.name),
            first = true,
            passedCurrentPosition = false;

        for (var i = 0; i < _this.$data.groups.length; i++) {
            var g = _this.$data.groups[i];

            if(first && g.name != group.name) {
                choices.push({
                    name: 'Position first',
                    value: 0
                });
            }
            first = false;

            if(g.name == group.name) {
                if(i != 0) choices.pop();
                currentPosition = i;
                passedCurrentPosition = true;
            }

            if(g.name != group.name) {
                choices.push({
                    name: 'Position after ' + chalk.yellow(g.name),
                    value: passedCurrentPosition ? i : i + 1
                });
            }
        }

        choices.push(new inquirer.Separator());

        message = currentPosition == 0 ? 'Keep current first position' : 'Keep current position after ' + chalk.yellow(_this.$data.groups[groupIndex - 1].name);

        choices.push({
            name: message,
            value: currentPosition
        });

        return choices;
    },

    getComponentPositionChoices: function(group) {
        var _this = this,
            groupIndex = _this.getGroupIndex(group),
            choices = [{
                name: 'Position first',
                value: 0
            }];

        for (var i = 0; i < _this.$data.groups[groupIndex].components.length; i++) {
            var c = _this.$data.groups[groupIndex].components[i];
            choices.push({
                name: 'Position after ' + chalk.yellow(c.name),
                value: i + 1
            });
        }

        return choices;
    },

    getGroupComponentCount: function(group) {
        return this.$data.groups[this.getGroupIndex(group)].components.length;
    },

    getGroupCount: function(group) {
        return this.$data.groups.length;
    },

    getComponent: function(group_name) {
        var _this = this,
            parts = group_name.split('/');

        for(var i = 0; i < _this.$data.groups.length; i++) {
            for(var j = 0; j < _this.$data.groups[i].components.length; j++) {
                var c = _this.$data.groups[i].components[j];

                if(c.group == parts[0] && c.name == parts[1]) {
                    return c;
                }
            }
        }

        return false;
    },

    validateSlug: function(string) {
        var slug = string.match(/^[a-z0-9-]+$/);

        return this.validateString(string) && slug && !! slug.length;
    },

    validateString: function(string) {
        return string != '';
    }
};