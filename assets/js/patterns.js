new Vue({

    el: 'html',

    data: {
        
    },

    ready: function() {
        this.loadDataFile();
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

                _this.loadComponents();
                _this.loadScripts();
            });
        },


        loadScripts: function() {
            for (var i = 0; i < this.assets.js.length; i++) {
                $('body').append('<script src="' + this.assets.js[i] + '"></script>');
            }
        },

        loadComponents: function() {
            for (var i = 0; i < this.components.length; i++) {
                this.loadComponent(this.components[i]);
            }
        },

        loadComponent: function(component) {
            $.get(component.template + '.html', function(data) {

            });

            $.get(component.template + '.md', function(data) {
                // Parse markdown
            });
        }

    }

});
