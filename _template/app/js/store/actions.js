import 'module-alias/register';
import getProjectData from '@appTemplate/js/core/utilities/get-project-data.js';

export default {
    setInitialState({ commit }) {

        const modules = [
            'assets',
            'components',
            'content',
            'info',
            'theme'
        ];

        // Load the project data
        getProjectData()
            .then(data => {

                // If it's all good, commit to each module's state
                modules.forEach(module => commit(`${module}/setInitialState`, data));
            })
            .catch(error => console.error(error));
    }
}