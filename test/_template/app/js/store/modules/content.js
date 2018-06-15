import 'module-alias/register';
import { expect } from 'chai';
import { mutations, state } from '@appTemplate/js/store/modules/content.js';

const defaultState = {
    show_first_page_on_load: true,
    title: 'Overview',
    pages: [
        {
            name: 'introduction',
            title: 'Introduction',
            file: './pages/intro.md'
        }
    ]
};
        
describe('App/Store/Content', () => {

    /**
     * Test to see wether the `setInitialState` mutation 
     * modifies state correctly
     */
    it('Payload should override inital state', () => {

        let intialState = Object.assign({}, defaultState);

        // data.json will have a content namesapce, so account for it here 
        let payload = {
            content: {
                show_first_page_on_load: false,
                title: 'Overview',
                pages: [
                    {
                        name: 'introduction',
                        title: 'Introduction',
                        file: './pages/intro.md'
                    },
                    {
                        name: 'another-page',
                        title: 'Another page',
                        file: './pages/another-page.md'
                    }
                ],
                deleteMe: 'plz'
            }
        };

        const desiredResult = {
            show_first_page_on_load: false,
            title: 'Overview',
            pages: [
                {
                    name: 'introduction',
                    title: 'Introduction',
                    file: './pages/intro.md'
                },
                {
                    name: 'another-page',
                    title: 'Another page',
                    file: './pages/another-page.md'
                }
            ]
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