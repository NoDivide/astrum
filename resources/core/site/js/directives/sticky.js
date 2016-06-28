/**
 * Sticky Element Helper
 *
 * Listens for scroll events and applies the specified class to the host
 * element if the scrollY value is larger or equal to the top offset of the
 * host.
 */
module.exports = {
    params: ['anchor'],
    isLiteral: true,
    bind: function() {
        var _this = this,
            anchor = document.querySelector(this.params.anchor) ? document.querySelector(this.params.anchor) : this.el,
            lowerThreshold = null,
            stickyClass = this.expression;

        /**
         * Send setting upper and lower thresholds to the back of the queue.
         */
        setTimeout(function() {
            lowerThreshold = anchor.offsetTop + anchor.offsetHeight;
        }, 0);


        /**
         * Listen for scroll events on window.
         */

        window.addEventListener('scroll', function(e) {
            var scrollTop = window.scrollY;

            if (scrollTop > lowerThreshold) {
                _this.el.classList.add(stickyClass);
            } else {
                _this.el.classList.remove(stickyClass);
            }
        });
    }
};
