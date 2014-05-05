var pg = require('pg');
var Constants = require('../Constants.js');
var RegistrationRecord = require('../Records/RegistrationRecord.js')

function RegistrationModel(username, reg_id){
    this.username = username;
    this.reg_id = reg_id;
    this.connection = null;
    this.parser = null;
    console.log("Registration:"+username);
    this.fields = {"username": username, "reg_id":reg_id};
    
    var self = this;
   
    this.set = function(callback) {
	var regRecord = new RegistrationRecord(self.username);
	regRecord.setUp(self.connection, self.parser);
	regRecord.remove(function(err) {
	    console.log(err);
	    if (err) {
		callback(Constants.ERROR);
		return;
	    }
	    regRecord.put("reg_id", self.reg_id);
	    regRecord.insert(function(err) {
		if (err) {
		    callback(Constants.ERROR);
		}
		else {
		    callback(Constants.SUCCESS);
		}
	    });
	});
    }

    this.clear = function(callback) {
	var regRecord = new RegistrationRecord(self.username);
	regRecord.setUp(self.connection, self.parser);
	regRecord.remove(function(err) {
	    console.log(err);
	    if (err) {
		callback(Constants.ERROR);
		return;
	    }
	    else {
		callback(Constants.SUCCESS);
	    }
	});
    }
    
    this.get = function(callback) {
	var regRecord = new RegistrationRecord(self.username);
	regRecord.setUp(self.connection, self.parser);
	regRecord.select(function(err) {
	    if (err) {
		callback(Constants.ERROR);
	    }
	    else {
		callback(Constants.SUCCESS, self.parser.parseRegistration(result));
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
}
module.exports = RegistrationModel;