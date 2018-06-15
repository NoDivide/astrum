import 'module-alias/register';
import { expect } from 'chai';
import { mutations, state } from '@appTemplate/js/store/modules/theme.js';

const defaultState = {
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
};
        
describe('App/Store/Theme', () => {

    /**
     * Test to see wether the `setInitialState` mutation 
     * modifies state correctly
     */
    it('Payload should override inital state', () => {

        let intialState = Object.assign({}, defaultState);

        // data.json will have a content namesapce, so account for it here 
        let payload = {
            theme: {
                border_color: '#FF00ff',
                highlight_color: '#000000',
                brand_color: '#00585C',
                background_color: '#FFFFFF',
                code_highlight_theme: 'github',
                override_code_highlight_bg: '#F9FAFC',
                sample_dark_background: '#333333',
                show_project_name: false,
                show_version: false,
                max_width: 1000,
                titles: {
                    library_title: 'Pattern Library Test Suite',
                    pages_title: 'Overview',
                    components_title: 'Components'
                },
                deleteMe: 'plz'
            }
        };

        const desiredResult = {
            border_color: '#FF00ff',
            highlight_color: '#000000',
            brand_color: '#00585C',
            background_color: '#FFFFFF',
            code_highlight_theme: 'github',
            override_code_highlight_bg: '#F9FAFC',
            sample_dark_background: '#333333',
            show_project_name: false,
            show_version: false,
            max_width: 1000,
            titles: {
                library_title: 'Pattern Library Test Suite',
                pages_title: 'Overview',
                components_title: 'Components'
            }
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