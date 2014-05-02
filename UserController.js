
//UserController
//

var UserModel = require('./UserModel.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');
var Constants = require('./Constants.js');
var UserController = function(res) {
    this.res = res;
    var self = this;
    this.verify = function(req) {
	if (req.session.user) {
	    var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL)
            var userModel = new UserModel(req.session.user);
            userModel.setDatabaseModel(db);
            userModel.setParser(new PostgreSQLParser());
            db.connect();
	    userModel.findUser(function(err) {
		db.end();
		res.header('Content-Type', 'application/json');
		if (err == Constants.SUCCESS) {
		    self.res.end(JSON.stringify({"errCode":Constants.SIGNED_IN}));
		}
		else {
		    self.res.end(JSON.stringify({"errCode":Constants.NOT_SIGNED_IN}));
		}
	    });
	}
	    else {
		self.res.header('Content-Type', 'application/json');
		self.res.end(JSON.stringify({"errCode":Constants.NOT_SIGNED_IN}));
	    }
    }

    this.logout = function(req) {
	res.header('Content-Type', 'application/json');
	if (req.session.user) {
	    req.session.user = null;
	    self.res.end(JSON.stringify({"errCode":Constants.SUCCESS}));
	}
	else {
	    self.res.end(JSON.stringify({"errCode":Constants.ERROR}));
	}
    }

	

    this.signup = function (req) {
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL)
        var userModel = new UserModel(req.body.user, req.body.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.signUp(function (err, result) {
	    db.end();
	    self.res.header('Content-Type', 'application/json');
	    var json = {errCode : err};
	    if (err == Constants.SUCCESS) {
		   req.session.regenerate(function() {
			req.session.user = req.body.user;
			req.session.save();
			self.res.end(JSON.stringify(json));
		    });
	    }
	    else {
		self.res.end(JSON.stringify(json));
	    }
	});
    }

    this.login = function (req) {
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        var userModel = new UserModel(req.body.user, req.body.password);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.login(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    self.res.header('Content-Type', 'application/json');
	    if (err == Constants.SUCCESS) {
		req.session.regenerate(function() {
		    req.session.user = req.body.user;
		    req.session.save();
		    self.res.end(JSON.stringify(json));
		});
	    }
	    else {
		self.res.end(JSON.stringify(json));
	    }
	});
    }

    this.changePassword = function (req) {
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        var userModel = new UserModel(req.body.user, req.body.password, null, req.body.newPassword);
        userModel.setDatabaseModel(db);
        userModel.setParser(new PostgreSQLParser());
        db.connect();
        userModel.changePassword(function (err, result) {
            db.end();
            var json = {errCode : err};
            self.res.header('Content-Type', 'application/json');
            self.res.end(JSON.stringify(json));
	});
    }


}
module.exports = UserController;




















