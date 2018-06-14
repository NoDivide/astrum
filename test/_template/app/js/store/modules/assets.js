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
            css: [],
            js: [],
            fontLibraries: {
                'typekitCode': null,
                'typographyWebFonts': null,
                'googleWebFonts': null
            }
        };

        let payload = {
            css: [
                '/path/to/styles.css'
            ],
            js: [
                '/path/to/large-bundle.js'
            ],
            fontLibraries: {
                'typekitCode': 'random-string',
                'typographyWebFonts': null,
                'googleWebFonts': null
            },
            deleteMe: 'plz'
        };

        const desiredResult = {
            css: [
                '/path/to/styles.css'
            ],
            js: [
                '/path/to/large-bundle.js'
            ],
            fontLibraries: {
                'typekitCode': 'random-string',
                'typographyWebFonts': null,
                'googleWebFonts': null
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
            css: [],
            js: [],
            fontLibraries: {
                'typekitCode': null,
                'typographyWebFonts': null,
                'googleWebFonts': null
            }
        };
        
        expect(defaultState).to.deep.equal(state);
    });
});