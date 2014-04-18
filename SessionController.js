// SessionController.js


var UserRecord = require('./UserRecord.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');
var Constants = require('./Constants.js');


var SessionController = function(res) {


    this.checkUser = function(user) {
    var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
    	var userRecord = new UserRecord(user);
    	var parser = new PostgreSQLParser();
    	userRecord.setUp(db, parser);
        db.connect();
        var json = {errCode : ''};
	    res.header('Content-Type', 'application/json');

        userRecord.select(function(err, result) {
		    console.log(err);
		    if (err) {
		    	db.end();
				json.errCode = Constants.ERROR;
				res.end(JSON.stringify(json));
		    }
		    result = parser.parseUser(result);
		    if (result.length == 0) {
		    	db.end();
				json.errCode = Constants.ERR_USER_NOTFOUND;
				res.end(JSON.stringify(json));
		    }
		    else {
		    	db.end();
				json.errCode = Constants.SUCCESS;
				res.end(JSON.stringify(json));
		    }
		});

    };


}
module.exports = SessionController;




















