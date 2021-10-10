/*
* Request handlers 
*
*/

//Dependencies
const _data = require('./data'); 
const helpers = require('./helpers');

// Define all the handlers
let handlers = {};

handlers.ping = (data, callback) => {
    callback(200);
};


handlers.users = (data, callback) => {
    // Acceptable Request Method for user.handlers
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._users[data.method](data, callback);
    }else{
      callback(405);
    }
};

// Create Container for the users submethods
handlers._users = {};

// Users - POST
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required field are filled out
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length <= 13 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement ==  true ? true : false;
  
  if(firstName && lastName && phone && password && tosAgreement){
      // Make sure that the use doesn't already exist
      _data.read('users', phone, (err, data) => {
        if(err){
          // Hash the password 
          let hashedPassword = helpers.hash(password);

          if(hashedPassword){
              // Create the user object
              let userObject = {
                'firstName' : firstName,
                'lastName' : lastName,
                'phone' : phone,
                'hashedPassword' : hashedPassword,
                'tosAgreement' : true
               };

              // Store the user
              _data.create('users', phone, userObject, (err) => {
                  if(!err){
                    callback(200, {'message' : 'User created successfully'});
                  }else{
                    console.log(err);
                    callback(500, {'Error' : 'Could not create the new user'});
                  }
                 });
          }else{
             callback(500, {'Error'  : 'Could not hash the user\'s password' });
          }
          
        }else{
          callback(400, {'Error' : 'A user with that phone number already exist'});
        }
      });
  }else{
    callback(400, {'Error' : 'Missing required fields'});
  }
};


// Users - GET
// Required data : phone
// Optional data : none
// @TODO Only let an authenticated user access their object. Don't let them access anyone elses
handlers._users.get = (data, callback) => {
  // Check that tlhe phone is valid
  let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length <= 13 ? data.queryStringObject.phone.trim() : false;
  if(phone){
      // Lookup the user
      _data.read('users', phone, (err, d) => {
          if(!err && d){
              // Remove the hashed password from the user object before returning it to the requester
              delete d.hashedPassword;
              callback(200, d)
          }else{
            callback(404, {'Error' : 'User does not exist'} );
          }
      }); 
  }else{
    callback(400, {'Error' : 'Missing required field' });
  }


};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.put = (data,callback) => {
  // Check for required field
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  // Check for optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(phone){
    // Error if nothing is sent to update
    if(firstName || lastName || password){
      // Lookup the user
      _data.read('users',phone, (err,userData) =>{
        if(!err && userData){
          // Update the fields if necessary
          if(firstName){
            userData.firstName = firstName;
          }
          if(lastName){
            userData.lastName = lastName;
          }
          if(password){
            userData.hashedPassword = helpers.hash(password);
          }
          // Store the new updates
          _data.update('users',phone,userData, (err)=>{
            if(!err){
              callback(200, {'message' : 'User updated successfully'});
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not update the user.'});
            }
          });
        } else {
          callback(400,{'Error' : 'Specified user does not exist.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }

};


// Required data: phone
// @TODO Only let an authenticated user delete their object. Dont let them delete update elses.
// @TODO Cleanup (delete) any other data files associated with the user
handlers._users.delete = (data,callback) => {
  // Check that tlhe phone is valid
  let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length <= 13 ? data.queryStringObject.phone.trim() : false;
  if(phone){
      // Lookup the user
      _data.read('users', phone, (err, d) => {
          if(!err && d){
            _data.delete('users',phone, (err) => {
              if(!err){
                callback(200, {'message' : 'User Deleted'});
              } else {
                callback(500,{'Error' : 'Could not delete the specified user'});
              }
            });
          }else{
            callback(404, {'Error' : 'User does not exist'} );
          }
      }); 
  }else{
    callback(400, {'Error' : 'Missing required field' });
  }
};



// Sample handler
// handlers.sample = (data,callback) => {
//     callback(406,{'name':'sample handler'});
// };

// Not found handler
handlers.notFound = (data,callback) => {
  callback(404, {'404' : 'Not Found'});
};



// Export the handler
module.exports = handlers;