module.exports = {
    template: require('./template.html'),

    props: {
        identifier: {
            type: String
        },
        forceShow: {
            type: Boolean
        },
        inverted: {
            type: Boolean
        }
    },

    data: function() {
        return {
            is_open: false
        }
    },

    ready: function() {
        var _this = this;

        _this.$on('open-modal', function(args) {
            _this.is_open = false;

            if(_this.identifier === args.identifier) {
                _this.is_open = true;
            }
        });
    },

    methods: {

        closeModal: function() {

            if(this.forceShow) return;

            this.is_open = false;
        }
    }
};
