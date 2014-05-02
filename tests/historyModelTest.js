var HistoryController = require('../Controllers/HistoryController.js');
var SQLite3Model = require('../Models/SQLite3DatabaseModel.js');
var HistoryModel = require('../Models/HistoryModel.js');
var RatingModel = require('../Models/RatingModel.js');
var SQLite3Parser = require('../Parsers/SQLite3Parser.js');
var Constants = require('../Constants.js');

var HelperMethods = require('../Helpers/TestHelperMethods.js');
var doSetup = HelperMethods.setupAndCreateUsers;

exports["testModelFields"] = function(test){
    var db = new SQLite3Model();
    test.expect(5);
    doSetup(db, function() {
        var historyModel = new HistoryModel('jernchr', 'OnionSoup', '5/21/17');
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new SQLite3Parser());
        test.equals(historyModel.username, 'jernchr');
        test.equals(historyModel.recipe_name, 'OnionSoup');
        test.equals(historyModel.datecreated, '5/21/17');
        historyModel.fields;
        historyModel.make;
        historyModel.hetAllHistoryFromUser;
        historyModel.deleteHistory;
        historyModel.clearAllHistoryFromUser;
        test.done()
        
    });
};

exports["testMakeRecipe"] = function(test){
    var db = new SQLite3Model();
    test.expect(5);
    doSetup(db, function() {
        var historyModel = new HistoryModel('jernchr', 'OnionSoup', '5/21/17');
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new SQLite3Parser());
        db.connect();
        historyModel.make(function(err, result) {
            test.equal(err, Constants.SUCCESS, "Make should be success");
            db.query("select * from "+ Constants.HISTORY_TABLE, function(err, rows) {
                db.end();
                test.equal(rows.length, 1, "Should be just one recipe made");
                var exp = { username: 'jernchr', recipe_name: 'OnionSoup', datecreated: '5/21/17'};
                var row = rows[0];
                testRecipeEqual(row, exp, test);
                test.done();
            });
        });
        test.done();
    });
};



