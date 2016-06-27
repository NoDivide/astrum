var Vue = require('vue');

/**
 * Directives
 * ----------------------------------------//
 */
Vue.directive('show-tab', require('./directives/show-tab.js'));

/**
 * Apps
 * ----------------------------------------//
 */
new Vue(require('./apps/homepage'));
