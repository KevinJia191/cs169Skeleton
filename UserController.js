
//UserController
//

var UserModel = require('./UserModel.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');

var UserController = function(res) {
    // postRequest is a json containing the fields: user, password
    // TODO: encrypt the password
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errCode:ERROR} if name is null or longer than 128 characters
    this.signup = function (postRequest) {
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL)
        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.signUp(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    // postRequest is a json containing the fields: user, hashed_password
    //{errCode:SUCCESS} if login succeeds
    //{errcode:ERR_INVAL_CRED}
    this.login = function (postRequest) {
        console.log(postRequest);

	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        var userModel = new UserModel(postRequest.user, postRequest.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.login(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }
}
module.exports = UserController;




















