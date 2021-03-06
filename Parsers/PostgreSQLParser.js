var Ingredient = require('../Models/Ingredient.js');
var UserModel = require('../Models/UserModel.js');
var HistoryModel = require('../Models/HistoryModel.js');
var RatingModel = require('../Models/RatingModel.js');
var DatabaseModel = require('../Models/DatabaseModel.js');

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

    this.parseIngredientReg = function(result) {
	var ingredients = {};
	if (result.rows.length == 0) {
	    return ingredients;
	}
	for (index = 0; index < result.rows.length; index++) {
	    var row = result.rows[index];
	    var ingredient = {};
	    ingredient["username"] = row["username"]
	    ingredient["ingredient_name"] = row["ingredient_name"];
	    ingredient["reg_id"] = row["reg_id"];	
	    ingredient["day"] = row["day"];
	    ingredient["year"] = row["year"];
	    ingredient["month"] = row["month"];
	    if (ingredients["username"]) {
		ingredients["username"].push(ingredient);
	    }
	    else {
		ingredients["username"] = [ingredient];
	    }
	}
	//console.log(ingredients);
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
}
module.exports = PostgreSQLParser;