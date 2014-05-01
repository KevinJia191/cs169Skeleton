// SessionController.js


var UserRecord = require('../Records/UserRecord.js');
var PostgreSQLDatabaseModel = require('../Models/PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('../Parsers/PostgreSQLParser.js');
var Constants = require('./Constants.js');


var SessionModel = function(res) {
    this.res = res;
    this.verify = function(session) {
	console.log("model:"+session.user);
	var self = this;
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
    	var userRecord = new UserRecord(session.user);
    	var parser = new PostgreSQLParser();
    	userRecord.setUp(db, parser);
        db.connect();
        var json = {errCode : ''};
        userRecord.select(function(err, result) {
	    self.res.header('Content-Type', 'application/json');
	    console.log(err);
	    if (err) {
		db.end();
		json.errCode = Constants.ERROR;
		self.res.end(JSON.stringify(json));
	    }
	    result = parser.parseUser(result);
	    if (result.length == 0) {
		db.end();
		json.errCode = Constants.ERR_USER_NOTFOUND;
		self.res.end(JSON.stringify(json));
	    }
	    else {
		db.end();
		json.errCode = Constants.SUCCESS;
		self.res.end(JSON.stringify(json));
	    }
	});

    };


}
module.exports = SessionModel;




















