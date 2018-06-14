/**
 * Override original data from new data set, only selecting the keys 
 * of the original data set.
 *
 * @param {Object} originalObject
 * @param {Object} newObject
 * @returns Object
 */
export default function limitedAssign(originalObject, newObject) {
    
    // Take a clone of the original object so we can keep the orginal
    // for comparing keys later in the function
    let response = Object.assign({}, originalObject);

    // Do a global assign of old and new to make sure we get the new data
    Object.assign(response, newObject);

    // Run each key of the response and filter out anything that 
    // didn't belong in the original object
    Object.keys(response).forEach(key => { 

        if(!originalObject.hasOwnProperty(key)) {
            delete response[key];
        }
    });

    return response;
};