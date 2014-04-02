var HistoryController = require('../HistoryController.js');
var SQLite3Model = require('./SQLite3DatabaseModel.js');
var HistoryModel = require('../HistoryModel.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');

var HelperMethods = require('./TestHelperMethods.js');
var doSetup = HelperMethods.setupAndCreateUsers;

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
		var exp = { username: 'jernchr', recipe_name: 'OnionSoup', dateCreated: '5/21/17'};
		var row = rows[0];
		testRecipeEqual(row, exp, test);
                test.done();
            });
        });
    });
};

exports["testMakeTwoRecipes"] = function(test){
    var db = new SQLite3Model();
    test.expect(9);
    doSetup(db, function() {
        var historyModel = new HistoryModel('jernchr', 'OnionSoup', '5/21/17');
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new SQLite3Parser());
        db.connect();
        historyModel.make(function(err, result) {
	    test.equal(err, Constants.SUCCESS, "Make should be success");
	    var historyModel = new HistoryModel('jernchr', 'Chicken Parmesan', '5/21/19');
            historyModel.setDatabaseModel(db);
            historyModel.setParser(new SQLite3Parser());
	    historyModel.make(function(err, result) {
		test.equal(err, Constants.SUCCESS, "Make should be success");
		db.query("select * from "+ Constants.HISTORY_TABLE, function(err, rows) {
                    db.end();
                    test.equal(rows.length, 2, "Should be two recipes made");
		    var exp = { username: 'jernchr', recipe_name: 'OnionSoup', dateCreated: '5/21/17'};
		    var exp2 = { username: 'jernchr', recipe_name: 'Chicken Parmesan', dateCreated: '5/21/19'};
		    if (rows[0]["recipe_name"] == "Chicken Parmesan") {

			testRecipeEqual(rows[0], exp2, test);
			testRecipeEqual(rows[1], exp, test);
		    }
		    else {
			testRecipeEqual(rows[0], exp, test);
			testRecipeEqual(rows[1], exp2, test);
		    }
                    test.done();
		});
	    });
        });
    });
};

exports["getHistory"] = function(test){
    var db = new SQLite3Model();
    test.expect(9);
    doSetup(db, function() {
        var historyModel = new HistoryModel('jernchr', 'OnionSoup', '5/21/17');
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new SQLite3Parser());
        db.connect();
        historyModel.make(function(err, result) {
	    var historyModel = new HistoryModel('jernchr', 'Chicken Parmesan', '5/21/19');
            historyModel.setDatabaseModel(db);
            historyModel.setParser(new SQLite3Parser());
	    historyModel.make(function(err, result) {
		test.equal(err, Constants.SUCCESS, "Make should be success");
		var historyModel = new HistoryModel('jernchr');
		historyModel.setDatabaseModel(db);
		historyModel.setParser(new SQLite3Parser());
		historyModel.getAllHistoryFromUser(function(err, results) {
		    test.equal(err, Constants.SUCCESS, "Get history should be success");
		    test.equal(results.length, 2);
		    var exp = { username: 'jernchr', recipe_name: 'OnionSoup', dateCreated: '5/21/17'};
		    var exp2 = { username: 'jernchr', recipe_name: 'Chicken Parmesan', dateCreated: '5/21/19'};
		    if (results[0].fields["recipe_name"] == "Chicken Parmesan") {
			console.log(results[1].fields);
			testRecipeEqual(results[0].fields, exp2, test);
			testRecipeEqual(results[1].fields, exp, test);
		    }
		    else {
			testRecipeEqual(results[1].fields, exp2, test);
			testRecipeEqual(results[0].fields, exp, test);
		    }
		    test.done();
		});
	    });
        });
    });
};




function testRecipeEqual(row, exp, test) {
    test.equal(row.username, exp.username, "Failed");
    test.equal(row.recipe_name, exp.recipe_name);
    test.equal(row.dateCreated, exp.dateCreated);
}