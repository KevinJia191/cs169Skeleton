var pg = require('pg');
var IngredientModel = require('./Ingredient.js');
var IngredientController = function(res) {

    this.res = res;
    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.addIngredient = function(postRequest) {
	console.log(postRequest);
	console.log(postRequest["user"]);
	console.log(postRequest["ingredient_name"]);
	console.log(postRequest["expiration_date"]);
	console.log(postRequest["quantity"]);
	console.log(postRequest["unit"]);
	var ingredientModel = new IngredientModel(postRequest["user"], postRequest["ingredient_name"], postRequest["expiration_date"], postRequest["quantity"], postRequest["unit"]);
	ingredientModel.add(function (err, result) {
	    var json = {errCode : err};
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }

    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.removeIngredient = function(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing the fields: user
    this.removeAll = function(postRequest) {
        return {errCode : 1};
    }
    // postRequest is a json containing the fields: user
    this.getInventory = function(postRequest) {
        return {errCode : 1};
    }
}
module.exports = IngredientController;