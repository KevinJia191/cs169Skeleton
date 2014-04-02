var HistoryController = require('../HistoryController.js');
var SQLite3Model = require('./SQLite3DatabaseModel.js');
var HistoryModel = require('../HistoryModel.js');
var RatingModel = require('../RatingModel.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');

var HelperMethods = require('./TestHelperMethods.js');
var doSetup = HelperMethods.setupAndCreateUsers;

exports["testMakeRecipe"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
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
                test.done();
            });
        });
    });
};
