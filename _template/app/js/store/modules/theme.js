import 'module-alias/register';
import getProjectData from '@appTemplate/js/core/utilities/get-project-data.js';
import limitedAssign from '@appTemplate/js/core/utilities/limited-assign.js';

export default {
    namespaced: true,
    state: {
        border_color: '#E0E6ED',
        highlight_color: '#F9FAFC',
        brand_color: '#00585C',
        background_color: '#FFFFFF',
        code_highlight_theme: 'github',
        override_code_highlight_bg: '#F9FAFC',
        sample_dark_background: '#333333',
        show_project_name: true,
        show_version: true,
        max_width: null,
        titles: {
            library_title: 'Pattern Library',
            pages_title: 'Overview',
            components_title: 'Components'
        }
    },
    mutations: {
        setInitialState(state, payload) {
            
            // Auto-override state values based on what was passed in
            Object.assign(state, limitedAssign(state, payload.theme));
        }
    },
    actions: {
        setInitialState({ commit }) {

            // Load the project data
            getProjectData()
                .then(data => {

                    // If it's all good, commit to state
                    commit('theme/setInitialState', data);
                })
                .catch(error => console.error(error));
        }
    }
};