var pg = require('pg');
var Constants = require('./Constants.js');
var UserRecord = require('./UserRecord.js');
//should extend the ActiveRecord class
function UserModel(username, password){
    this.username = username;
    this.password = password;
    this.connection = null;
    this.parser = null;
    var self = this;
    this.signUp = function(callback) { 
	if(this.username.length > 128 || this.username.length == 0) {
            callback(Constants.BAD_USER);
            return;
        }
	if (this.password.length > 128) {
	    callback(Constants.BAD_PASSWORD);
	    return;
	}
	var userRecord = new UserRecord(this.username, this.password);
	userRecord.setUp(self.connection, self.parser);
	userRecord.insert(function(err) {
	    if (err) {
		callback(Constants.ERR_USER_EXISTS);
	    }
	    else {
		callback(Constants.SUCCESS);
	    }
	});
    }

    this.login = function(callback) {
	if(this.username.length == 0 || this.username.length > 128 || this.password.length > 128) {
            callback(Constants.ERR_INVAL_CRED);
            return;
        }
	var userRecord = new UserRecord(this.username, this.password);
	userRecord.setUp(self.connection, self.parser);
	userRecord.select(function(err, result) {
	    if (err) {
		callback(Constants.ERROR);
		return;
	    }
	    var result = self.parser.parseUser(result);
	    if (result.length == 0) {
		callback(Constants.ERR_INVAL_CRED);
	    }
	    else {
		callback(Constants.SUCCESS);
	    }
	});
    }

    this.setParser = function(parser) {
        this.parser = parser;
    }

    this.getParser = function() {
        return this.parser;
    }
    
    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
}
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errcode:ERR_INVAL_CRED} if username exists but password does not match

module.exports = UserModel;













