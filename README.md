# node-user-repository
A brand new user service written in Node, utilising Nedb (in-memory document store for now)

## Running with docker
### Prerequisite
1. Must have Docker installed, please follow instructions on https://docs.docker.com/engine/installation/ if you haven't done so already.
2. Open up a console where ```docker -v``` returns something similar to ```Docker version 17.12.0-ce, build c97c6d6```
3. In the console, change directory to root folder of this cloned project.
4. Run ```docker build . -t frankyfrankyren/node-user-service```, if there's any error, try running it again with ```sudo``` privilege or as ```Administrator```
5. Ensure Postman is installed (via chrome store)

### Running server
```
docker run -p 8080:8080 frankyfrankyren/node-user-service
```
Then server will be running on localhost port 8080.</br>

## Running without docker
### Prerequisite
1. Must have NodeJs installed, please follow instructions on https://nodejs.org/en/download/ if you haven't done so already.
2. Open up a console where ```npm -v``` returns something similar to ```3.10.10```
3. In the console, change directory to root folder of this cloned project.
4. Run ```npm install```, if there's any error, try running it again with ```sudo``` privilege or as ```Administrator```
5. Ensure Postman is installed (via chrome store)

### Running server
```
npm start
```
Then server will be running on localhost port 8080.</br>



## Endpoints
| Url | Request Method | Description | Usages | Sample Output |
|---|---|---|---|---|
| /users | GET | Retrieves information for all users in a JSON array format | http://localhost:8080/users | ```[]``` if there are no users </br> ```[{"id":"123","email":"example@hotmail.com","forename":"Yankai","surname":"Ren","created":"2018-01-04T00:33:34.987Z"}]``` if users exists |
| /user/<id> | GET | Based on mandatory query parameter <id>, Retrieves information for single user in a JSON array format | ```http://localhost:8080/user/<id>``` with an id of your choice | ```404``` if user does not exist </br> ```{"id":"123","email":"example@hotmail.com","forename":"Yankai","surname":"Ren","created":"2018-01-04T00:33:34.987Z"}``` if user exists |
| /user/create | POST | Creates user | 1. In postman, paste the following url ```http://localhost:8080/user/create``` </br> 2. Change method to ```POST``` </br> 3. Select ```Body``` </br> 4. Populate ```Key``` fields with ```id```, ```email```, ```forename```, ```surname``` respectively, and populate their corresponding ```Value``` fields. | ```400``` if request body is mal-formed (either unknown fields or illegal values) </br> ```409``` if user with the same ```id``` already exists </br> ```201``` if accepted |
| /user/update/<id> | POST | Updates user <id> with either combinations of 'email', 'forename' and 'surname' | 1. In postman, paste the following url ```http://localhost:8080/user/update/<id>``` with an id of your choice </br> 2. Change method to ```POST``` </br> 3. Select ```Body``` </br> 4. Populate ```Key``` fields with any combinations but nothing more than ```email```, ```forename```, ```surname``` respectively, and populate their corresponding ```Value``` fields. | ```400``` if request body is mal-formed (either unknown fields or illegal values) </br> ```404``` if user id does not exist </br> ```204``` if accepted | 
| /user/<id> | DELETE | Deletes user with key <id> | 1. In postman, paste the following url ```http://localhost:8080/user/<id>``` with any id of your choice </br> 2. Change method to ```DELETE``` </br> 3. Clear everything in ```Body``` section | ```404``` if user id does not exist </br> ```204``` if accepted |

## Running test
```
npm test
```

## Scope for Improvements
Absolutely loads, e.g:
* Cover more edge cases in test
* More descriptive response returned by server on failures
* Use ES2016 with babel for a better OO design.
* (potentially) create a user interface interacting with the server, currently ```http://localhost:8080/users``` and ```http://localhost:8080:/user/<id>``` requests can be made via browser, others will have to be made via POSTMAN.

