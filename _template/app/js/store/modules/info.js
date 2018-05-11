import getProjectData from '../../core/utilities/get-project-data';

export default {
    namespaced: true,
    state: {
        project_logo: null,
        project_favicon: null,
        project_name: null,
        project_url: null,
        copyright_start_year: null,
        client_name: null,
        client_url: null,
        creators: {} 
    },
    mutations: {
        setState(state, payload) {

            // Auto-override state values based on what was passed in
            Object.assign(state, payload);        
        }
    },
    actions: {
        setInitialState({ commit }) {

            // Load the project data
            getProjectData()
                .then(data => {

                    // If it's all good, commit to state
                    commit('info/SET_INITIAL_STATE', data);
                })
                .catch(error => console.error(error));
        }
    }
};