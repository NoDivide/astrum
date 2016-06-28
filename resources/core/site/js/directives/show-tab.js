var _ = require('underscore');

module.exports = {
    params: ['container'],

    bind: function() {
        /**
         * Tab pane IDs are prefixed with `tab-` to prevent the browser
         * from jumping to that section of the page when the page loads.
         */
        var _this = this,
            container = document.getElementById(this.params.container) ? document.getElementById(this.params.container) : document,
            hash = window.location.hash ? window.location.hash.replace('#', '') : null,
            identifier = this.expression,
            tab = container.querySelector('#tab-' + identifier),
            navItem = document.querySelector('.nav__link[href="#tab-' + identifier + '"]').parentElement;

        if (hash && hash === identifier) {
            _this.show(tab, navItem);
        } else if (hash && container.querySelector('#tab-' + hash)) {
            _this.hide(tab, navItem);
        }

        /**
         * Listen for changes on the page hash.
         */
        window.addEventListener('hashchange', function(e) {
            hash = window.location.hash ? window.location.hash.replace('#', '') : null;

            if (hash === identifier && navItem && tab) {
                _this.show(tab, navItem);
            } else if (container.querySelector('#tab-' + hash)) {
                _this.hide(tab, navItem);
            }
        });

        /**
         * Listen for click event and update the hash.
         */
        _this.el.addEventListener('click', function(e) {
            e.preventDefault();

            window.location.hash = identifier;
        });
    },

    /**
     * Show a tab.
     *
     * @param  {Element} tab
     * @param  {Element} navItem
     * @return {undefined}
     */
    show: function(tab, navItem) {
        tab.classList.add('active');
        navItem.classList.add('active');
    },

    /**
     * Hide a tab.
     *
     * @param  {Element} tab
     * @param  {Element} navItem
     * @return {undefined}
     */
    hide: function(tab, navItem) {
        tab.classList.remove('active');
        navItem.classList.remove('active');
    }
};
