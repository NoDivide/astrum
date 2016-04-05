new Vue({

    el: 'html',

    ready: function() {
        this.loadDataFile();

        var _this = this;
        setTimeout(function() {
            console.log(_this);
        }, 3000);
    },

    methods: {

        /**
         * Reads the patterns.json file.
         *
         * @return {undefined}
         */
        loadDataFile: function() {
            var _this = this;

            $.get('patterns.json', function(data) {
                _this.$data = data;

                _this.loadScripts();
                _this.setupGroups();
                _this.loadComponents();
            });
        },

        loadScripts: function() {
            for (var i = 0; i < this.assets.js.length; i++) {
                $('body').append('<script src="' + this.assets.js[i] + '"></script>');
            }
        },

        loadComponents: function() {
            for (var i = 0; i < this.groups.length; i++) {
                for (var j = 0; j < this.groups[i].components.length; j++) {
                    var component = this.groups[i].components[j];

                    this.loadComponent(component);
                }
            }
        },

        loadComponent: function(component) {
            var _this = this;

            $.get('components/' + component.template + '.html', function(data) {
                component.html = data;
            });

            $.get('components/' + component.template + '.md', function(data) {
                component.description = data;
            });
        },

        setupGroups: function() {
            // Loop through the groups
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                group.components = [];

                for (var j = 0; j < this.components.length; j++) {
                    if (this.components[j].group === group.name) {
                        // Add html and description properties to the component object.
                        this.$set('components[' + j + '].html', '');
                        this.$set('components[' + j + '].description', '')

                        group.components.push(this.components[j]);
                    }
                }
            }

            delete this.$delete('components');
        }

    }

});
