var Vue = require('vue');

/**
 * Directives
 * ----------------------------------------//
 */
Vue.directive('show-tab', require('./directives/show-tab.js'));
Vue.directive('sticky', require('./directives/sticky.js'));

/**
 * Apps
 * ----------------------------------------//
 */
new Vue(require('./apps/homepage'));
