module.exports = {
    el: '[data-app=homepage]',

    data: {
        $pjson: {},
        version: null
    },

    ready: function() {
        var _this = this;

        _this.getPackageVersion();
    },

    methods: {

        getPackageVersion: function () {
            var _this = this;

            _this.$http.get('https://raw.githubusercontent.com/NoDivide/astrum/master/package.json' + '?cb=' + new Date()).then(function (response) {
                _this.$pjson = JSON.parse(response.data);
                _this.$set("version", _this.$pjson.version);
            });
        }
    }
}
