
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
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL)
        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.signUp(function(resultingJson) {
            db.end();
            callback(resultingJson);
        });
    }

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
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.login(function(resultingJson) {
            db.end();
            callback(resultingJson);
            return;
        });
    }
}
module.exports = UserController;




















