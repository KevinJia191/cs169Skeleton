var HistoryController = require('../HistoryController.js');
var SQLite3Model = require('./SQLite3DatabaseModel.js');
var RatingModel = require('../RatingModel.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');

var HelperMethods = require('./TestHelperMethods.js');
var doSetup = HelperMethods.setupAndCreateUsers;

exports["testRateRecipe"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'TomatoSoup', 3);
        ratingModel.setDatabaseModel(db);
        ratingModel.setParser(new SQLite3Parser());
        db.connect();
        ratingModel.rate(function(err, result) {
            test.equal(err, Constants.SUCCESS, "Rate should be success");
            db.query("select * from "+ Constants.RATING_TABLE, function(err, rows) {
                db.end();
                test.equal(rows.length, 1, "Should be just one recipe rated");
                test.done();
            });
        });
    });
};

exports["testBadRatingRecipeFail"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'TomatoSoup', -1);
        ratingModel.setDatabaseModel(db);
        ratingModel.setParser(new SQLite3Parser());
        db.connect();
        ratingModel.rate(function(err, result) {
            test.equal(err, Constants.INVALID_RATING, "Rate should be fail");
            db.query("select * from "+ Constants.RATING_TABLE, function(err, rows) {
                db.end();
                test.equal(rows.length, 0, "Should be no recipe's rated");
                test.done();
            });
        });
    });
};