import Vue from 'vue/dist/vue.js';
import VueX from 'vuex';

// Import core actions, getters and mutations 
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

// Import modules 
import info from './modules/info';

// Construct modules into an object 
export const modules = {
    info
};

// The core data structure of the store
export const state = {};

Vue.use(VueX);

export default new VueX.Store({ 
    state,
    mutations,
    actions,
    getters,
    modules
});