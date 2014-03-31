
//UserController
//

var UserModel = require('./UserModel.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');

var UserController = function(res) {
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




















