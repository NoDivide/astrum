import temporaryStorage from './temporary-storage';

/**
 * Return the main data file from either cache or via fetch
 * 
 * @export function
 * @param {string} [path='data.json'] 
 * @returns Promise 
 */
export default function getProjectData(path = 'data.json') {
    
    return new Promise(resolve => {
        
        let cachedData = temporaryStorage.get('astrum-core-data');

        // If there's cached data, resolve 
        if(cachedData !== null) {
            resolve(cachedData);
            return;
        }

        // Get the data file
        fetch(path)
            .then(response => { return response.json() })
            .then(json => {

                // Set the data in local storage for 20 seconds
                // TODO: When we've got some socket/live reload stuff, we can extend this and invalidate when it changes instead
                return temporaryStorage.set('astrum-core-data', json, 20000);
            })
            .then((data) => resolve(data))
            .catch(error => {
                console.warn(`There was an issue loading the project data: "${error}". Loading empty object instead.`);
                resolve({});
            });
    });
};