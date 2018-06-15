import 'module-alias/register';
import { expect } from 'chai';
import { mutations, state } from '@appTemplate/js/store/modules/components.js';

const defaultState = {
    groups: []
};
        
describe('App/Store/Components', () => {

    /**
     * Test to see wether the `setInitialState` mutation 
     * modifies state correctly
     */
    it('Payload should override inital state', () => {

        let intialState = Object.assign({}, defaultState);

        let payload = {
            groups: [
                {
                    'name': 'button',
                    'title': 'Button',
                    'components': [
                        {
                            'group': 'button',
                            'name': 'default',
                            'title': 'Default',
                            'width': 'half'
                        }
                    ]
                }
            ],
            deleteMe: 'plz'
        };

        const desiredResult = {
            groups: [
                {
                    'name': 'button',
                    'title': 'Button',
                    'components': [
                        {
                            'group': 'button',
                            'name': 'default',
                            'title': 'Default',
                            'width': 'half'
                        }
                    ]
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