import 'module-alias/register';
import getProjectData from '@appTemplate/js/core/utilities/get-project-data.js';
import limitedAssign from '@appTemplate/js/core/utilities/limited-assign.js';

export default {
    namespaced: true,
    state: {
        show_first_page_on_load: true,
        title: 'Overview',
        pages: [
            {
                name: 'introduction',
                title: 'Introduction',
                file: './pages/intro.md'
            }
        ]
    },
    mutations: {
        setInitialState(state, payload) {
            
            // Auto-override state values based on what was passed in
            Object.assign(state, limitedAssign(state, payload.content));
        }
    },
    actions: {
        setInitialState({ commit }) {

            // Load the project data
            getProjectData()
                .then(data => {

                    // If it's all good, commit to state
                    commit('content/setInitialState', data);
                })
                .catch(error => console.error(error));
        }
    }
};