import 'module-alias/register';
import { expect } from 'chai';
import { mutations, state } from '@appTemplate/js/store/modules/assets.js';

describe('App/Store/Assets', () => {

    /**
     * Test to see wether the `setInitialState` mutation 
     * modifies state correctly
     */
    it('Payload should override inital state', () => {

        let intialState = {
            assets: {
                css: [],
                js: []
            },
            font_libraries: {
                typekit_code: null,
                typography_web_fonts: null,
                google_web_fonts: null
            }
        };

        let payload = {
            assets: {
                css: [
                    '/path/to/styles.css'
                ],
                js: [
                    '/path/to/large-bundle.js'
                ]
            },  
            deleteMe: 'plz'
        };

        const desiredResult = {
            assets: {
                css: [
                    '/path/to/styles.css'
                ],
                js: [
                    '/path/to/large-bundle.js'
                ]
            },  
            font_libraries: {
                typekit_code: null,
                typography_web_fonts: null,
                google_web_fonts: null
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
        const defaultState = {
            assets: {
                css: [],
                js: []
            },
            font_libraries: {
                typekit_code: null,
                typography_web_fonts: null,
                google_web_fonts: null
        }
        };
        
        expect(defaultState).to.deep.equal(state);
    });
});