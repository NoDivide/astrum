import 'module-alias/register';
import { expect } from 'chai';
import { mutations } from '@appTemplate/js/store/modules/info';

describe('App/Store/Info', () => {
    it('Payload should override state', () => {

        const state = {
            shallowProp: 'Default value',
            deep: {
                prop: 'Default value 2'
            }
        };

        const payload = {
            shallowProp: 'New value',
            deep: {
                prop: 'New value 2'
            }
        };

        mutations.setInitialState(state, payload);

        expect(state).to.deep.equal(payload);
    });
});