import 'module-alias/register';
import limitedAssign from '@appTemplate/js/core/utilities/limited-assign.js';

export default {
    namespaced: true,
    state: {
        assets: {
            css: [],
            js: []
        },
        font_libraries: {
            typekit_code: null,
            typography_web_fonts: null,
            google_web_fonts: null
        }
    },
    mutations: {
        setInitialState(state, payload) {
            
            // Auto-override state values based on what was passed in
            Object.assign(state, limitedAssign(state, payload));
        }
    }
};