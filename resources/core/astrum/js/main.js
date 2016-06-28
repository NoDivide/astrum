var Vue = require('vue');

/**
 * Directives
 * ----------------------------------------//
 */
Vue.directive('show-tab', require('../../site/js/directives/show-tab.js'));

/**
 * Apps
 * ----------------------------------------//
 */
 new Vue({
     el: '[data-app=astrum]'
 });
