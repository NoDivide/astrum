require('dotenv').config();

/**
 * Try and get an .env value. Return fallback if it can't be found.
 * 
 * @param {String} key 
 * @param {String} fallback 
 * @returns {String}
 */
module.exports = function getEnvValue(key, fallback) {

    if(typeof(process.env[key]) !== 'undefined') {
        return process.env[key];
    }

    return fallback;
};