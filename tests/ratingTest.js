var HistoryController = require('../Controllers/HistoryController.js');
var SQLite3Model = require('../Models/SQLite3DatabaseModel.js');
var RatingModel = require('../Models/RatingModel.js');
var SQLite3Parser = require('../Parsers/SQLite3Parser.js');
var Constants = require('../Constants.js');

var HelperMethods = require('../Helpers/TestHelperMethods.js');
var doSetup = HelperMethods.setupAndCreateUsers;

exports["testRateRecipe1"] = function(test){
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

exports["testRateRecipe2"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'TomatoSoup', 5);
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

exports["testRateRecipe3"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'Soup', 3);
        ratingModel.setDatabaseModel(db);
        ratingModel.setParser(new SQLite3Parser());
        db.connect();
        ratingModel.rate(function(err, result) {
            test.equal(err, Constants.SUCCESS, "Rate should be success");
            db.query("select * from "+ Constants.RATING_TABLE, function(err, rows) {
                db.end();
                test.equal(rows.length, 2, "Should be just one recipe rated");
                test.done();
            });
        });
    });
};

exports["testBadRating1"] = function(test){
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


exports["testBadRating2"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'TomatoSoup', 0);
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



exports["testBadRating3"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', 'TomatoSoup', null);
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



exports["testBadRating4"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function() {
        var ratingModel = new RatingModel('jernchr', null, 5);
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






