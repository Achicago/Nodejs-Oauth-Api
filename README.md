# Nodejs-Oauth-Api
NodeJs application that support user authentication, write users to disk, Support HTTPS and uses no npm packages 

# Config Library Included
Run NODE_ENV={staging / production } to use either staging or production module
  find in the config.js

  # Support HTTPS

  mkdir https && cd https

  Use in your Command-Line, To Generate Node HTTPS
  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem


  # Node API With HTTPS Enabled with NO NPM Packages
  - With Data(CRUD) Library
  - Hashing password, Using crypto Library
  - Creating and storing  new User to the disk in a '.json' file with the data.js Library

  How to Use

```bash
USE Postman or Any API Client of your choice

  POST => localhost:3000/users
            {Body => raw}
            {
              "firstName" : "Ani",
              "lastName" : "Ama",
              "phone" : "5555555555",
              "password" : "password",
              "tosAgreement" : true 
            }

  GET => localhost:3000/users?phone=5555555555

  PUT => localhost:3000/users
            {Body => raw}
            {
              "firstName" : "Amaka",
              "phone" : "5555555555"
            }

  DELETE => localhost:3000/users?phone=5555555555
  
//////////////////////////////////////////Token


USE Postman or Any API Client of your choice

  POST => localhost:3000/users
            {Body => raw}
            {
              "lastName" : "Ama",
              "phone" : "5555555555"
            }
     To get Token and All
        {
          "phone": "5555555555",
          "id": "3knwosb99arbe92zh1x8",
          "expires": 1633714723562
        }

```
![Image of Login Page](https://github.com/Achicago/Nodejs-Oauth-Api/blob/main/screenshot-nimbus-capture-2021.10.08-02_02_40.png)

# No npm packages need here
- You can also use https://localhost:3001 in staging mode
- And https://localhost:5001 in production mode
- Run NODE_ENV={staging / production } node index.js to start the node app


