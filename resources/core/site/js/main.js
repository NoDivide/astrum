var Vue = require('vue');
Vue.use(require('vue-resource'));

/**
 * Components
 * ----------------------------------------//
 */
Vue.component('astrum-modal', require('./components/modal/component.js'));

/**
 * Directives
 * ----------------------------------------//
 */
Vue.directive('show-tab', require('./directives/show-tab.js'));
Vue.directive('show-modal', require('./directives/show-modal.js'));
Vue.directive('sticky', require('./directives/sticky.js'));
Vue.directive('toggle', require('./directives/toggle.js'));

/**
 * Apps
 * ----------------------------------------//
 */
new Vue(require('./apps/homepage'));
