var Ingredient = require('../Models/Ingredient.js');
var UserModel = require('../Models/UserModel.js');
var HistoryModel = require('../Models/HistoryModel.js');
var RatingModel = require('../Models/RatingModel.js');
var DatabaseModel = require('../Models/DatabaseModel.js');
function SQLite3Parser() {

    this.parseError = function(err) {
	if (err) {
	    return DatabaseModel.ERROR;
	}
	else {
	    return DatabaseModel.SUCCESS;
	}
    }
    
    
    this.parseIngredient = function(rows) {
        var ingredients = new Array();
        if (rows.length == 0) {
            return ingredients;
        }
        for (index = 0; index < rows.length; index++) {
            var row = rows[index];
            var ingredient = new Ingredient(row["username"], row["ingredient_name"], row["expiration_date"], row["quantity"], row["unit"]);
            ingredients[index] = ingredient;
        }
        return ingredients;
    }
    
    this.parseUser = function(result) {
        var users = new Array();
        if (result.length == 0) {
            return users;
        }
        for (index = 0; index < result.length; index++) {
            var row = result[index];
            var user = new UserModel(row["username"], row["hashed_password"], row["salt"]);
            users[index] = user;
        }
        return users;
    }
    
    this.parseHistory = function(result) {
        var histories = new Array();
        if (result.length == 0) {
            return histories;
        }
        for (index = 0; index < result.length; index++) {
            var row = result[index];
            var history = new HistoryModel(row["username"], row["recipe_name"], row["datecreated"]);
            histories[index] = history;
        }
        return histories;
    }
    
    this.parseRating = function(result){
        var ratings = new Array();
        if (result.length == 0) {
            return ratings;
        }
        for (index = 0; index < result.length; index++) {
            var row = result[index];
            var rating = new RatingModel(row["username"], row["recipe_name"], row["rating"]);
            ratings[index] = rating;
        }
        return ratings;
    }
}
module.exports = SQLite3Parser;