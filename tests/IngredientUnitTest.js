//var sqlite3 = require("sqlite3").verbose();
var SQLite3Model = require('./SQLite3DatabaseModel.js');
var IngredientModel = require('../Ingredient.js');
var SQLite3Parser = require('./SQLite3Parser.js');
exports["testSomething"] = function(test){
    var db = new SQLite3Model();
    db.connect();
    var createTables = "Create table users (username text primary key,hashed_password text);"
    db.query(createTables, function(err, results) {
	console.log(err);
	db.query("Create table ingredients (username text,ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text, primary key(username,ingredient_name,expiration_date)); ", function(err, results) {
	    console.log(err);
	    var ingredientModel = new IngredientModel('jernchr', 'pepper', '5/21/17', 4, 'oz');
	    ingredientModel.setDatabaseModel(db);

	    ingredientModel.setParser(new SQLite3Parser());
	    ingredientModel.connect();
	    ingredientModel.add(function(err, result) {
		console.log("tolo");
		db.query("select * from ingredients", function( err, rows) {
		console.log(err);
		console.log(rows);
		db.end();
		test.expect(1);
		test.ok(true, "this assertion should pass");
		test.done();
	    });
	    });
	    
	});
    });
};
