var Ingredient = require('../Ingredient.js');
var UserModel = require('../UserModel.js');
var History = require('../Recipe.js');
var DatabaseModel = require('../DatabaseModel.js');
function SQLite3Parser() {

    this.parseError = function(err) {
	console.log("yeh");
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
        //console.log(result)
        var users = new Array();
        if (result.length == 0) {
            return users;
        }
        for (index = 0; index < result.length; index++) {
            var row = result[index];
            //console.log("thisrow is " + row);
            var user = new UserModel(row.username, row.hashed_password);
            //console.log("thisuser is" + user);
            users[index] = user;
        }
        //console.log("hello"+users);
        return users;
    }
    
    this.parseHistory = function(result) {
        var histories = new Array();
        if (result.length == 0) {
            return histories;
        }
        for (index = 0; index < result.length; index++) {
            var row = result[index];
            var history = new Recipe(row["username"], row["recipe_name"], row["dateCreated"], row["rating"]);
            histories[index] = history;
        }
        return histories;
    }
}
module.exports = SQLite3Parser;