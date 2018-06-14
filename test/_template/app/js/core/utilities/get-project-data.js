import 'module-alias/register';
import { expect } from 'chai';
import getProjectData from '@appTemplate/js/core/utilities/get-project-data.js';
import jsdom from 'mocha-jsdom';

describe('App/Core/Utilities', () => {

    jsdom();

    it('If nothing is found, we should still get an empty object back', async () => {
        const responseData = await getProjectData('this-should-error.json');

        expect(responseData).to.be.a('object');
    });
});