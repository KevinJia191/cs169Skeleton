var SQLite3Model = require('./SQLite3DatabaseModel.js');
var UserModel = require('../UserModel.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');
var HelperMethods = require('./TestHelperMethods.js');
var doSetup = HelperMethods.doSetup;


exports["testSignup"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function(err, results) {
        //console.log(err);
        var userModel = new UserModel('testUser', 'testPass');
        userModel.setDatabaseModel(db);
        userModel.setParser(new SQLite3Parser());
        userModel.connect(function(){
            userModel.signUp(function(resultingJson) {
                db.query("select * from users", function(err, rows) {
                    db.end();
                    test.equal(rows.length, 1, "Length of returns did not match");
                    //var exp = { username: 'testUser', recipe_name: 'OnionSoup', dateCreated: '5/21/17', rating: 4};
                    //var row = rows[0];
                    test.done();
                });
            });
        });
    });
};

