module.exports = {
    params: ['identifier'],

    update: function() {
        var _this = this,
            identifier = this.expression;

        /**
         * If no expression is passed set identifier to parameter.
         */
        identifier = !identifier ? this.params.identifier : identifier;

        /**
         * If identifier is still empty, die.
         */
        if (typeof(identifier) !== 'string' || identifier.length < 1) {
            return;
        }

        /**
         * Listen for click event and broadcast 'open-modal'.
         */
        _this.el.addEventListener('click', function(e) {
            e.preventDefault();

            _this.vm.$root.$broadcast('open-modal', { identifier: identifier });
        });
    }
};
