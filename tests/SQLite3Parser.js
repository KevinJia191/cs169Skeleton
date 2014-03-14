var Ingredient = require('../Ingredient.js');
function SQLite3Parser() {    
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
}
module.exports = SQLite3Parser;