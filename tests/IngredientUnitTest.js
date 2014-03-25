/*
*@author Christopher
*
*/
var SQLite3Model = require('./SQLite3DatabaseModel.js');
var IngredientModel = require('../Ingredient.js');
var SQLite3Parser = require('./SQLite3Parser.js');
var Constants = require('../Constants.js');
/*
* SQLite3 appears to ignore foreign key constraint checks. For example, I can directly add an item to the Ingredient's table without having the specified user in the
* Users table. To save a extra callback, I directly added items to a user's inventory even when the user isn't in the User's table.
*
* These tests are poorly written. Unfortunately, research time was a lot more extensive than I had anticipated.
*/


exports["testAddIngredient"] = function(test){
    var db = new SQLite3Model();
    test.expect(7);
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 4, 'oz');
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add(function(err, result) {
	    test.equal(err, Constants.SUCCESS, "Add should have succeeded");
	    db.query("select * from ingredients", function(err, rows) {
		db.end();
		test.equal(rows.length, 1, "Length of returns did not match");
		var exp = { username: 'jernchr', ingredient_name: 'pepper', expiration_date: '5/21/17', quantity: 4, unit: 'oz' };
		var row = rows[0];
		testIngredientEqual(row, exp, test);
		test.done();
	    });
	});
    });
	    
};

exports["testAddIngredient"] = function(test){
    var db = new SQLite3Model();
    test.expect(7);
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 4, 'oz');
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add(function(err, result) {
	    test.equal(err, Constants.SUCCESS, "Add should have succeeded");
	    db.query("select * from ingredients", function(err, rows) {
		db.end();
		test.equal(rows.length, 1, "Length of returns did not match");
		var exp = { username: 'jernchr', ingredient_name: 'pepper', expiration_date: '5/21/17', quantity: 4, unit: 'oz' };
		var row = rows[0];
		testIngredientEqual(row, exp, test);
		test.done();
	    });
	});
    });
	    
};

exports["testAddIngredientInvalidUser"] = function(test){
    var db = new SQLite3Model();
    test.expect(1);
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('invalidname', 'pepper', '5/21/17', -23, 'oz');
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add(function(err, result) {
	    test.equal(err, Constants.INVALID_USER, "Can't add ingredient for invalid user");
	});
    });
	    
};



exports["testRemoveIngredientNonExistent"] = function(test){
    var db = new SQLite3Model();
    test.expect(2);
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 10, 'oz');
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.remove(function(err, result) {
	    test.equal(err, Constants.DOESNT_EXIST, "Can't remove a nonexistent item");
	    db.query("select * from ingredients", function(err, rows) {
		db.end();
		test.equal(rows.length, 0, "Length of returns did not match");
		test.done();
	    });
	});
    });
	    
};





exports["testUpdateAddIngredient"] = function(test){
    var db = new SQLite3Model();
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 4, 'oz');
	ingredientModel.setDatabaseModel(db);
	
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add( function(err, results) {
	    var ingredientModel2 = new IngredientModel('jernchr', 'pepper', '5/21/17', 12, 'oz');
	    ingredientModel2.setDatabaseModel(db);
	    ingredientModel2.setParser(new SQLite3Parser());
	    ingredientModel2.add(function(err, result) {
		db.query("select * from ingredients", function(err, rows) {
		    db.end();
		    test.expect(6);
		    test.equal(rows.length, 1, "Length of returns did not match");
		    var exp = { username: 'jernchr', ingredient_name: 'pepper', expiration_date: '5/21/17', quantity: 16, unit: 'oz' };
		    var row = rows[0];
		    testIngredientEqual(row, exp, test);
		    test.done();
		});
	    });
	});
	
    });
	    
};

exports["testUpdateRemoveIngredient"] = function(test){
    var db = new SQLite3Model();
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 12, 'oz');
	ingredientModel.setDatabaseModel(db);
	
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add( function(err, results) {
	    var ingredientModel2 = new IngredientModel('jernchr', 'pepper', '5/21/17', 10, 'oz');
	    ingredientModel2.setDatabaseModel(db);
	    ingredientModel2.setParser(new SQLite3Parser());
	    ingredientModel2.remove(function(err, result) {
		db.query("select * from ingredients", function(err, rows) {
		    db.end();
		    test.expect(6);
		    test.equal(rows.length, 1, "Length of returns did not match");
		    var exp = { username: 'jernchr', ingredient_name: 'pepper', expiration_date: '5/21/17', quantity: 2, unit: 'oz' };
		    var row = rows[0];
		    testIngredientEqual(row, exp, test);
		    test.done();
		});
	    });
	});
	
    });
	    
};


exports["testAddTwoIngredients"] = function(test){
    var db = new SQLite3Model();
    doSetup(db, function(err, results) {
	console.log(err);
	var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 12, 'oz');
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new SQLite3Parser());
	db.connect();
	ingredientModel.add( function(err, results) {
	    var ingredientModel2 = new IngredientModel('jernchr', 'salt', '5/28/17', 8, 'oz');
	    ingredientModel2.setDatabaseModel(db);
	    ingredientModel2.setParser(new SQLite3Parser());
	    ingredientModel2.add(function(err, result) {
		db.query("select * from ingredients", function(err, rows) {
		    db.end();
		    test.expect(11);
		    console.log(rows.length);
		    test.equal(rows.length, 2, "Length of returns did not match");
		    var exp = { username: 'jernchr', ingredient_name: 'pepper', expiration_date: '5/21/17', quantity: 12, unit: 'oz' };
		    var row = rows[0];
		    if (row != undefined) {
			testIngredientEqual(row, exp, test);
		    }
		    exp = { username: 'jernchr', ingredient_name: 'salt', expiration_date: '5/28/17', quantity: 8, unit: 'oz' };
		    row = rows[1];
		    if (row != undefined) {
			testIngredientEqual(row, exp, test);
		    }
		    test.done();
		});
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
	    db.query(createHistory, function(err, results) {
		db.query("insert into users values('jernchr', 'foo')", callback);
	    });
	});
    });
}


function testIngredientEqual(row, exp, test) {
    test.equal(row.username, exp.username, "Failed");
    test.equal(row.ingredient_name, exp.ingredient_name);
    test.equal(row.expiration_date, exp.expiration_date);
    test.equal(row.quantity, exp.quantity);
    test.equal(row.unit, exp.unit);

}


