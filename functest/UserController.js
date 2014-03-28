
//UserController
//

var UserModel = require('./UserModel.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');

var UserController = function(request) {

    this.request = request;

    // postRequest is a json containing the fields: user, password
    // TODO: encrypt the password
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errCode:ERROR} if name is null or longer than 128 characters
    this.signup = function (postRequest, callback) {

        var user = postRequest.user;
        //Checking if name formatted correctly
        if(user === null || user.length > 128 || typeof user === 'undefined') {
            callback(JSON.stringify({errCode:'ERROR'}));
            return;
        }

        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(new PostgreSQLDatabaseModel(process.env.DATABASE_URL));
        userModel.setParser(new PostgreSQLParser());
        
        userModel.connect(function(){
            userModel.signUp(function(resultingJson) {
            userModel.end();
            callback(resultingJson);
            return;
            });
        });
        //console.log("connection is over, now going to try to signup");
        

        //return {'errCode' : 1};
    } // end of THIS.SIGNUP



    // postRequest is a json containing the fields: user, hashed_password
    //{errCode:SUCCESS} if login succeeds
    //{errcode:ERR_INVAL_CRED}
    this.login = function (postRequest,callback) {
        console.log(postRequest);
        var user = postRequest.user;
        console.log("User is " + user);
        //Checking if name formatted correctly
        if(user === null || user.length > 128 || typeof user === 'undefined') {
            callback(JSON.stringify({errCode:'ERR_INVAL_CRED'}));
            return;
        }

        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(new PostgreSQLDatabaseModel(process.env.DATABASE_URL));
        userModel.setParser(new PostgreSQLParser());
        
        userModel.connect(function(){
            userModel.login(function(resultingJson) {
                userModel.end();
                callback(resultingJson);
                return;
            });
        });
        

        //return {'errCode' : 1};
    }
}
module.exports = UserController;




















