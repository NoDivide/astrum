import 'module-alias/register';
import { expect } from 'chai';
import { mutations, state } from '@appTemplate/js/store/modules/info.js';

const defaultState = {
    project_logo: null,
    project_favicon: null,
    project_name: null,
    project_url: null,
    copyright_start_year: null,
    client_name: null,
    client_url: null,
    creators: [],
    version: '' 
};
        
describe('App/Store/Info', () => {

    /**
     * Test to see wether the `setInitialState` mutation 
     * modifies state correctly
     */
    it('Payload should override inital state', () => {

        let intialState = Object.assign({}, defaultState);

        let payload = {
            project_logo: 'path/to/logo.png',
            project_favicon: null,
            project_name: null,
            project_url: null,
            copyright_start_year: null,
            client_name: null,
            client_url: null,
            creators: [
                {
                    'name': 'No Divide',
                    'url': 'http://nodividestudio.com'
                }
            ],
            version: '1.1.9', 
            deleteMe: 'plz'
        };

        const desiredResult = {
            project_logo: 'path/to/logo.png',
            project_favicon: null,
            project_name: null,
            project_url: null,
            copyright_start_year: null,
            client_name: null,
            client_url: null,
            creators: [
                {
                    'name': 'No Divide',
                    'url': 'http://nodividestudio.com'
                }
            ],
            version: '1.1.9'
        }

        mutations.setInitialState(intialState, payload);

        expect(intialState).to.deep.equal(desiredResult);
    });

    /**
     * Test that our default state, with no overrides is what
     * we expect it to be
     */
    it('Default state should be predictable', () => {
        expect(defaultState).to.deep.equal(state);
    });
});