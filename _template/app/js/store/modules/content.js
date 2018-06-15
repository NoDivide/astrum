import 'module-alias/register';
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
    }
};