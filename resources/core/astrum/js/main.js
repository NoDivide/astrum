var Vue = require('vue');

/**
 * Components
 * ----------------------------------------//
 */
Vue.component('astrum-modal', require('../../site/js/components/modal/component.js'));

/**
 * Directives
 * ----------------------------------------//
 */
Vue.directive('show-tab', require('../../site/js/directives/show-tab.js'));
Vue.directive('show-modal', require('../../site/js/directives/show-modal.js'));

/**
 * Apps
 * ----------------------------------------//
 */
 new Vue({
     el: '[data-app=astrum]'
 });
