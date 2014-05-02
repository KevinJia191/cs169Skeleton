var SQLite3Model = require('../Models/SQLite3DatabaseModel.js');
var UserModel = require('../Models/UserModel.js');
var RegModel = require('../Models/RegistrationModel.js');
var SQLite3Parser = require('../Parsers/SQLite3Parser.js');
var Constants = require('../Constants.js');
var HelperMethods = require('../Helpers/TestHelperMethods.js');
var doSetup = HelperMethods.doSetup;
var crypto = require('crypto');



exports["registerTest"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var userModel = new UserModel('testUser', 'testPass', 'abc');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
        
        var regModel = new RegModel('testUser', 'testRegID');
        regModel.setDatabaseModel(db);
        regModel.setParser(new SQLite3Parser());
        db.connect();
        userModel.signUp(function(err) {
            test.equal(err, Constants.SUCCESS);
            regModel.set(function(err2){
                test.equal(err2, Constants.SUCCESS);
                test.done();
            });
        });
    });
};
