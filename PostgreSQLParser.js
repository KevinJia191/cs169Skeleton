var Ingredient = require('./Ingredient.js');
function PostgreSQLParser() {    
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
            var user = new UserModel(row["username"], row["hashed_password"]);
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
            var history = new Recipe(row["username"], row["recipe_name"], row["dateCreated"], row["rating"]);
            histories[index] = history;
        }
        return histories;
    }
    
}
module.exports = PostgreSQLParser;