var SQLite3Model = require('../Models/SQLite3DatabaseModel.js');
var UserModel = require('../Models/UserModel.js');
var SQLite3Parser = require('../Parsers/SQLite3Parser.js');
var Constants = require('../Constants.js');
var HelperMethods = require('../Helpers/TestHelperMethods.js');
var doSetup = HelperMethods.doSetup;
var crypto = require('crypto');



exports["testSignup"] = function(test){
    var db = new SQLite3Model();
    test.expect(5);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass', 'abc');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    test.equal(err, Constants.SUCCESS);
            db.query("select * from users", function(err, rows) {
                db.end();
                test.equal(rows.length, 1, "Length of returns did not match");
		var hashFunction = crypto.createHash('sha256');
		hashFunction.update("testPass" + 'abc');
		var hashed_password = hashFunction.digest().toString('hex');
		var exp = {"username":"testUser", "hashed_password": hashed_password, "salt": "abc"};
		var row = rows[0];
		console.log(row);
		testUsersEqual(row, exp, test);
                //var exp = { username: 'testUser', recipe_name: 'OnionSoup', dateCreated: '5/21/17', rating: 4};
                //var row = rows[0];
                test.done();
            });
        });
	
    });
};

exports["testSignupTwice"] = function(test){
    var db = new SQLite3Model();
    test.expect(5);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass', 'abc');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    userModel.signUp(function(err) {
		test.equal(err, Constants.ERR_USER_EXISTS);
		db.query("select * from users", function(err, rows) {
                    db.end();
                    test.equal(rows.length, 1, "Length of returns did not match");
		    var hashFunction = crypto.createHash('sha256');
		    hashFunction.update("testPass" + 'abc');
		    var hashed_password = hashFunction.digest().toString('hex');
		    var exp = {"username":"testUser", "hashed_password": hashed_password, "salt": "abc"};
		    var row = rows[0];
		    console.log(row);
		    testUsersEqual(row, exp, test);
                    //var exp = { username: 'testUser', recipe_name: 'OnionSoup', dateCreated: '5/21/17', rating: 4};
                    //var row = rows[0];
                    test.done();
		});
            });
	});
    });
};

exports["testLogin"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass', 'abc');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    userModel.login(function(err) {
		test.equal(err, Constants.SUCCESS);
		test.done();
            });
	});
    });
};


exports["testLoginInvalidPassword"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    var userModel2 = new UserModel('testUser', 'testPass2');
            userModel2.setDatabaseModel(db);
            userModel2.setParser(new SQLite3Parser());
	    userModel2.login(function(err) {
		test.equal(err, Constants.ERR_INVAL_CRED);
		test.done();
            });
	});
    });
};

exports["testLoginInvalidUser"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    var userModel2 = new UserModel('testUser2', 'testPass');
            userModel2.setDatabaseModel(db);
            userModel2.setParser(new SQLite3Parser());
	    userModel2.login(function(err) {
		test.equal(err, Constants.ERR_INVAL_CRED);
		test.done();
            });
	});
    });
};

exports["testAddInvalidUser"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('', 'testPass');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
		test.equal(err, Constants.BAD_USER);
		test.done();
	});
    });
};

exports["testAddInvalidUser2"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
	var longUser = "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu";
        var userModel = new UserModel(longUser);
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
	    test.equal(err, Constants.BAD_USER);
	    test.done();
	});
    });
};


exports["testAddInvalidPassword"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function() {
	var longUser = "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu";
        var userModel = new UserModel(longUser, 'testPass');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
	db.connect();
        userModel.signUp(function(err) {
		test.equal(err, Constants.BAD_USER);
		test.done();
	});
    });
};

function testUsersEqual(row, exp, test) {
    test.equal(row.username, exp.username);
    test.equal(row.hashed_password, exp.hashed_password);
    test.equal(row.salt, exp.salt);
}