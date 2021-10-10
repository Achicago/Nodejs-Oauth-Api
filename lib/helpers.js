/*
* Helpers for various task
*
*/
// Dependencies
let crypto = require('crypto');
let config = require('./config');

// Containers for all the helpers
let helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0){
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try{
        let obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
};



// Export Module
module.exports = helpers;