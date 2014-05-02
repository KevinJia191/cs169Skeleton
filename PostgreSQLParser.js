var Ingredient = require('./Ingredient.js');
var UserModel = require('./UserModel.js');
var HistoryModel = require('./HistoryModel.js');
var RatingModel = require('./RatingModel.js');
var DatabaseModel = require('./DatabaseModel.js');

function PostgreSQLParser() {
    this.errMap = { '23505':DatabaseModel.UNIQUE_VIOLATION, '23503':DatabaseModel.FOREIGN_KEY_VIOLATION, '2300': DatabaseModel.CONSTRAINT_VIOLATED};


    this.parseError = function(err) {
	if (err) {
	    console.log(this.errMap[err["code"]]);
	    return {"errCode": this.errMap[err["code"]]};
	}
	else {
	    return DatabaseModel.SUCCESS;
	}
    }
    
    
    this.parseIngredient = function(result) {
	var ingredients = new Array();
	if (result.rows.length == 0) {
	    return ingredients;
	}
	for (index = 0; index < result.rows.length; index++) {
	    var row = result.rows[index];
	    var ingredient = new Ingredient(row["username"], row["ingredient_name"], row["expiration_date"], row["quantity"], row["unit"]);
	    ingredients[index] = ingredient;
	}
	return ingredients;
    }
    
    this.parseUser = function(result) {
        var users = new Array();
        if (result.rows.length == 0) {
            return users;
        }
        for (index = 0; index < result.rows.length; index++) {
            var row = result.rows[index];
            var user = new UserModel(row["username"], row["hashed_password"], row["salt"]);
            users[index] = user;
        }
        return users;
    }
    
    this.parseHistory = function(result) {
        var histories = new Array();
        if (result.rows.length == 0) {
            return histories;
        }
        for (index = 0; index < result.rows.length; index++) {
            var row = result.rows[index];
            var history = new HistoryModel(row["username"], row["recipe_name"], row["datecreated"]);
            histories[index] = history;
        }
	console.log(histories);
        return histories;
    }
    
    this.parseRating = function(result){
        var ratings = new Array();
        if (result.rows.length == 0) {
            return ratings;
        }
        for (index = 0; index < result.rows.length; index++) {
            var row = result.rows[index];
            var rating = new RatingModel(row["username"], row["recipe_name"], row["rating"]);
            ratings[index] = rating;
        }
        return ratings;
    }

    this.parseRegistration = function(result) {
	var registrations = new Array();
	if (result.rows.length == 0) {
	    return registrations;
	}
	for (index = 0; index < result.rows.length; index++) {
	    var row = result.rows[index];
	    var registration = new RegistrationModel(row["username"], row["reg_id"]);
	    registrations[index] = registration;
	}
	return registrations;
    }
}
module.exports = PostgreSQLParser;