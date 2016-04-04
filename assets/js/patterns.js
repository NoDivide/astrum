new Vue({

    el: 'html',

    data: {

    },

    ready: function() {
        this.loadDataFile();

        /**
         * Initialise syntax highlighting
         */
        hljs.initHighlightingOnLoad();
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
                    this.groups[i].components[j] = this.loadComponent(this.groups[i].components[j]);
                }
            }
        },

        loadComponent: function(component) {

            // FIXME: need the original component model to get updated here.
            $.get('components/' + component.template + '.html', function(data) {
                component.$set('html', data);
            });

            $.get('components/' + component.template + '.md', function(data) {
                // TODO: Parse markdown
                component.$set('description', data);
            });

            return component;
        },

        setupGroups: function() {
            // Loop through the groups
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                group.components = [];

                for (var j = 0; j < this.components.length; j++) {
                    if (this.components[j].group === group.name) {
                        group.components.push(this.components[j]);
                    }
                }
            }
        }

    }

});
