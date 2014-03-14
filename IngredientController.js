var pg = require('pg');
var IngredientModel = require('./Ingredient.js');
var IngredientController = function(res) {

    this.res = res;
    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.addIngredient = function(postRequest) {
	console.log(postRequest);
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], postRequest["unit"]);
	ingredientModel.connect();

	ingredientModel.add(function (err, result) {
	    ingredientModel.end();
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
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], null);
	ingredientModel.remove(function (err, result) {
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    // postRequest is a json containing the fields: user
    this.removeAll = function(postRequest) {
	var ingredientModel = new IngredientModel(postRequest["user"]);
	ingredientModel.remove(function (err, result) {
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }
    // postRequest is a json containing the fields: user
    this.getInventory = function(postRequest) {
        var ingredientModel = new IngredientModel(postRequest["user"]);
	ingredientModel.get(function (err, result) {
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }
}
module.exports = IngredientController;