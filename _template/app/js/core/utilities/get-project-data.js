import temporaryStorage from './temporary-storage';

export default function getProjectData() {
    
    return new Promise((resolve, reject) => {
        
        let cachedData = temporaryStorage.get('astrum-core-data');

        // If there's cached data, resolve 
        if(cachedData !== null) {
            resolve(cachedData);
            return;
        }

        // Get the data file
        fetch('data.json')
            .then(response => { return response.json() })
            .then(json => {

                // Set the data in local storage for 5 seconds
                return temporaryStorage.set('astrum-core-data', json, 5000);
            })
            .then(resolve(data))
            .catch(reject('There was an issue loading the project data'));
    });
};