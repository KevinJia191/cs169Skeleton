var pg = require('pg');
var IngredientModel = require('./Ingredient.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');
/*
 * Controller for the Ingredient model that takes in json requests and responds with json.
 * @author Christopher
 */
var IngredientController = function(res) {

    this.res = res;
    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.addIngredient = function(postRequest) {
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], postRequest["unit"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new PostgreSQLParser());
	db.connect();
	ingredientModel.add(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    if (result != null) {
		json["new_quantity"] = result;
	    }
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    // postRequest is a json containing fields: user, ingredient_name, quantity, expiration_date
    this.removeIngredient = function(postRequest) {
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], postRequest["unit"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new PostgreSQLParser());
	db.connect();
	if (postRequest["quantity"] != null) {
	    ingredientModel.remove(function (err, result) {
		db.end();
		var json = {errCode : err};
		if (result != null) {
		    json["new_quantity"] = result;
		}
		res.header('Content-Type', 'application/json');
		res.end(JSON.stringify(json));
	    });
	}
	else {
	    ingredientModel.removeIngredient(function (err, result) {
		db.end();
		var json = {errCode : err};
		res.header('Content-Type', 'application/json');
		res.end(JSON.stringify(json));
	    });
	}
    }

    // postRequest is a json containing the fields: user
    this.removeAll = function(postRequest) {
	var ingredientModel = new IngredientModel(postRequest["user"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new PostgreSQLParser());
	db.connect();
	ingredientModel.removeAll(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    // postRequest is a json containing the fields: user
    this.getInventory = function(postRequest) {
        var ingredientModel = new IngredientModel(postRequest["user"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new PostgreSQLParser());
	db.connect();
	ingredientModel.getInventory(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    var inventory = new Array();
	    for (index = 0; index < result.length; index++) {
		var ingredient = { "ingredient_name":result[index].ingredient_name, "expiration_date":result[index].expiration_date, "quantity": result[index].quantity, "unit":result[index].unit};
		inventory[index] = ingredient;
	    }
	    json["items"] = inventory;
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    this.updateIngredient = function(postRequest) {
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], postRequest["unit"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	ingredientModel.setDatabaseModel(db);
	ingredientModel.setParser(new PostgreSQLParser());
	db.connect();
	ingredientModel.updateIngredientAmount(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }


}
module.exports = IngredientController;