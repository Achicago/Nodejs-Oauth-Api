/*
*  Library for storing and editing data
*
*/

// Dependencies

let fs = require('fs');
let path = require('path');
const helpers = require('./helpers');

// Container for the module (to be exported)
let lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            // Convert data to string
            let stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file');
                        }
                    });
                }else{
                    callback('Error writing to new file');
                }
            });
        }else{
            callback('Could not create new file, it may already exist');
        }
    });
};
 
// Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', (err, data) => {
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        }else{
           callback(err, data);
        }
    });
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
                // Convert data to string
                let stringData = JSON.stringify(data);

                // Trucate the file
                fs.ftruncate(fileDescriptor, (err) => {
                    if(!err){
                        // write to the file and clone it
                        fs.writeFile(fileDescriptor, stringData, (err) => {
                            if(!err){
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        callback(false);
                                    }else{
                                        callback('Error closing the file');
                                    }
                                });
                            }else{
                                callback('Error writing to existing file');
                            }
                        });
                    }else{
                        callback('Error trucating file');
                    }
                });
        }else{
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
};

// Deletea file
lib.delete = (dir, file, callback) => {
    // Unlicking the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    });
};


// Export the module
module.exports = lib;
