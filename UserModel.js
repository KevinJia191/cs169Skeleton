var pg = require('pg');
var Constants = require('./Constants.js');
var UserRecord = require('./UserRecord.js')
var crypto = require('crypto');

function UserModel(username, password, salt){
    this.username = username;
    this.password = password;
    this.salt = salt;
    this.connection = null;
    this.parser = null;
    var self = this;
    this.signUp = function(callback) { 
	var self = this;
	if(self.username.length > 128 || self.username.length == 0) {
            callback(Constants.BAD_USER);
            return;
        }
	if (self.password.length > 128) {
	    callback(Constants.BAD_PASSWORD);
	    return;
	}
	try {
	    var salt = crypto.randomBytes(64).toString('hex');
	    if (self.salt) {
		salt = self.salt;
	    }
	    var hashFunction = crypto.createHash('sha256');
	    hashFunction.update(self.password + salt);
	    var hashed_password = hashFunction.digest().toString('hex');
	    var userRecord = new UserRecord(self.username, hashed_password, salt);
	    userRecord.setUp(self.connection, self.parser);
	    userRecord.insert(function(err) {
		if (err) {
		    callback(Constants.ERR_USER_EXISTS);
		}
		else {
		    callback(Constants.SUCCESS);
		}
	    });
	} catch (ex) {
	    callback(Constants.ERROR);
	}
    }

    this.login = function(callback) {
	var self = this;
	if(self.username.length == 0 || self.username.length > 128 || self.password.length > 128) {
            callback(Constants.ERR_INVAL_CRED);
            return;
        }
	var userRecord = new UserRecord(self.username);
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
		try {
		    var hashFunction = crypto.createHash('sha256');
		    hashFunction.update(self.password + result[0]["salt"]);
		    var hashed_password = hashFunction.digest().toString('hex');
		    // Fix parser in the future to return a UserRecord object instead of a UserModel.
		    if (hashed_password.valueOf() == result[0]["password"]) {
			callback(Constants.SUCCESS);
		    }
		    else {
			callback(Constants.ERR_INVAL_CRED);
		    }
		}
		catch(err) {
		    console.log(err);
		    callback(Constants.ERROR);
		}
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













