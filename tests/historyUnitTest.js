var HistoryController = require('../HistoryController.js');


var SQLite3Model = require('./SQLite3DatabaseModel.js');
var HistoryModel = require('../Recipe.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');

exports["testMakeRecipe"] = function(test){
    var db = new SQLite3Model();
    test.expect(3);
    console.log("1");
    doSetup(db, function(err, results) {
        console.log("2");
        console.log(err);
        var historyModel = new HistoryModel('testUser', 'OnionSoup', '5/21/17', 4);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new SQLite3Parser());
        historyModel.connect();
        historyModel.make(function(resultingJson) {
            console.log("whatsup");
            test.equal(resultingJson.errCode, Constants.SUCCESS, "Make has not been added");
            db.query("select * from history", function(err, rows) {
                db.end();
                test.equal(rows.length, 1, "Length of returns did not match");
                var exp = { username: 'testUser', recipe_name: 'OnionSoup', dateCreated: '5/21/17', rating: 4};
                var row = rows[0];
                test.done();
            });
        });
    });
};

function doSetup(db, callback) {
    db.connect();
    var createUsers = "Create table users (username text primary key,hashed_password text);"
    db.query(createUsers, function(err, results) {
        console.log(err);
        db.query("Create table ingredients (username text references users(username),ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text, primary key(username,ingredient_name,expiration_date)); ", function(err, results) {
            var createHistory = "Create table history (username text references users(username), recipe_name text, dateCreated text, rating int check(rating > 0 AND rating <= 5), primary key(username,recipe_name,dateCreated));";
            db.query(createHistory, function(err, results){
                console.log('hey did we get here');
                var createUser = "Insert into users values ('testUser', 'testPass');";
                db.query(createUser, callback);
            });
        });
    });
}