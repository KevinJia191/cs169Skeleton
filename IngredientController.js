var pg = require('pg');
var IngredientModel = require('./Ingredient.js');
var IngredientController = function(request) {

    this.request = request;
    this.ingredientModel = new IngredientModel();
    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.addIngredient = function(postRequest) {
	console.log("TEST PRINT");
	var connection = new pg.Client(process.env.DATABASE_URL);
	connection.connect();
	connection.query("SELECT * FROM Users", function(err, result) {
	    console.log(result);
	});
        return {errCode : 1};
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