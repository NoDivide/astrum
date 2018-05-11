export default temporaryStorage = {

    /**
     * Retrieve data by a key. If the data has an expiration, it'll return 
     * null if expired 
     * 
     * @param {string} key 
     * @returns mixed
     */
    get(key) {

        let response = null;

        if(!this.storageIsSupported()) {
            return response;
        }

        // Load up the data
        response = localStorage.getItem(key);

        // Bail if null. We can do no more
        if(response === null) {
            return response;
        }

        // Convert to json if not null
        response = JSON.parse(response);

        // Test expiration if set
        if(response.expires) {

            // If the expiration hasn't been reached yet, keep the data. 
            // If it has expired, set it as null
            response = ((new Date().getTime()) < response.expires ? response : null);

            // If it's expired, remove it
            if(response == null) {
                localStorage.removeItem(key);
            }
        }

        // Return data within storage or null
        return (response !== null ? response.data : null);
    },

    /**
     * Set some data in local storage with an optional expiration in milliseconds
     * 
     * @param {string} key 
     * @param {string} data 
     * @param {number} [expiryMilliseconds=0] 
     * @returns Promise
     */
    set(key, data, expiryMilliseconds = 0) {

        return new Promise((resolve, reject) => {

            let storeObject = {};

            if(!this.storageIsSupported()) {
                reject('Storage isn\'t supported or the user has it disabled');    
            }

            // If an expiry was passed in, add it to the storage object
            if(expiryMilliseconds > 0) {
                storeObject.expires = (new Date().getTime()) + expiryMilliseconds;
            }

            // Set the passed data
            storeObject.data = data;
            localStorage.setItem(key, JSON.stringify(storeObject));

            // All sorted, so resolve our promise
            resolve(storeObject.data);
        });
    },

    /**
     * Test to see if local storage is supported and if there's no 
     * quota issues if it is supported
     * 
     * @returns boolean 
     */
    storageIsSupported() {

        try {
            // Attempt to set some storage and see what happens
            let tempKey = 'astrum-storage-test';

            localStorage.setItem(tempKey, 'testing');
            localStorage.removeItem(tempKey);

            // We got here so it's all good
            return true;
        }
        catch(ex) {
            // Something didn't work. Base our response on the following: 
            return ex instanceof DOMException && (

                // Every browser except Firefox
                ex.code === 22 ||

                // Oh hai Firefox
                ex.code === 1014 ||

                // The browser may have thrown this instead (not Firefox though)
                ex.name === 'QuotaExceededError' || 

                // Oh hai again Firefox
                ex.name === 'NS_ERROR_DOM_QUOTA_REACHED') 
                
                // Lastly checked there's anything stored because the previous statements are irrelevant otherwise
                && localStorage.length !== 0;
        }
    }
};