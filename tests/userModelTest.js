var SQLite3Model = require('../Models/SQLite3DatabaseModel.js');
var UserModel = require('../Models/UserModel.js');
var SQLite3Parser = require('../Parsers/SQLite3Parser.js');
var Constants = require('../Constants.js');
var HelperMethods = require('../Helpers/TestHelperMethods.js');
var doSetup = HelperMethods.doSetup;
var crypto = require('crypto');



exports["testModelFields"] = function(test){
    var db = new SQLite3Model();
    test.expect(5);
    doSetup(db, function() {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass', 'abc');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
        test.equals(userModel.username, 'testUser');
        test.equals(userModel.password,'testPass');
        userModel.salt;
        userModel.newPassword;
        userModel.connection;
        userModel.parser;
        userModel.signUp;
        userModel.login;
        test.done()
	
    });
};

exports["testModelSignUp"] = function(test){
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
                test.done()
        var hashFunction = crypto.createHash('sha256');
        hashFunction.update("testPass" + 'abc');
        var hashed_password = hashFunction.digest().toString('hex');
        var exp = {"username":"testUser", "hashed_password": hashed_password, "salt": "abc"};
        var row = rows[0];
        console.log(row);
        testUsersEqual(row, exp, test);
                test.done();
            });
        test.done();
        });
    
    });
};