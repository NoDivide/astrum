module.exports = {

    bind: function() {
        var _this = this,
            identifier = this.expression,
            container = document.getElementById(identifier);

        /**
         * If no container is found abandon ship.
         */
        if (!container) {
            return;
        }

        /**
         * Listen for click event.
         */
        _this.el.addEventListener('click', function(e) {
            e.preventDefault();

            // Toggle the .open class on the container.
            container.classList.toggle('open');
        });
    }
};
