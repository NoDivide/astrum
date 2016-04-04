new Vue({

    el: 'body',

    data: {

    },

    ready: function() {
        this.loadDataFile();
    },

    methods: {

        loadDataFile: function() {
            var _this = this;

            $.get('patterns.json', function(data) {
                _this.$data = data;
            });
        }

    }

});
