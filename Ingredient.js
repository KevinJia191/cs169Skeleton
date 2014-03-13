var pg = require('pg');

/*
* Model for an ingredient. username, ingredient_name, expiration_date are primary keys.
* All methods in here have a callback function of format function(err, result);
* A database model must be set in order to execute add, remove, etc.
*/
function Ingredient(username, ingredient_name, expiration_date, quantity, unit){
    this.username = username;
    this.ingredient_name = ingredient_name;
    this.expiration_date = expiration_date;
    this.quantity = quantity;
    this.unit = unit;
    //this.attributes = {"username":username, "ingredient_name": ingredient_name, "expiration_date":expiration_date, "quantity":quantity, "unit":unit};
    
    /* 
     * Adds the ingredient to the User's inventory.
     * These fields CANNOT be null: username, ingredient_name, expiration_date, quantity, unit
     * result will be null if the ingredient was not previously present, or the updated amount of
     * the ingredient.
     */
    this.add = function(callback) {
	var connection = new pg.Client(process.env.DATABASE_URL);
	connection.connect();
	var addQuery = "insert into ingredients values('"+this.username+"', '"+this.ingredient_name+"','"+this.expiration_date+"', '"+this.quantity+"', '"+this.unit+"')";
	connection.query(addQuery, function(err, result) {
	    console.log(err);
	    connection.end();
	    callback(Ingredient.SUCCESS_ADDED, null);
	});
    }
    /* 
     * Removes a quantity of an ingredient from  the User's inventory.
     * These fields CANNOT be null: username, ingredient_name, expiration_date, quantity
     * If unit is not specified, the currently stored unit for this ingredient will be used.
     * result will be the amount of the ingredient left.
     */
    this.remove = function(callback) {
    
    }

    /*
     * Gets the ingredient with the specified parameters passed into the constructor. 
     * For example, if you only specify username and all other fields are null,
     * then all ingredients possessed by that user will be stored in result.
     * result will be a list of ingredients. If sortby was set, the list will be sorted, otherwise order
     * is not guaranteed.
     */
    this.get = function(callback) {
	var connection = new pg.Client(process.env.DATABASE_URL);
	connection.connect();
	var addQuery = "select * from ingredients where";
	var isFirst = true;
	if (this.username != null) {
	    if (!isFirst) {
		addQuery = addQuery + " AND";
		isFirst = false;
	    }
	    addQuery = addQuery + " username " + " = " + "'" + this.username;
	}
	if (this.username != null) {
	    if (!isFirst) {
		addQuery = addQuery + " AND";
		isFirst = false;
	    }
	    addQuery = addQuery + " username " + " = " + "'" + this.username;
	}
	connection.query(addQuery, function(err, result) {
	    console.log(err);
	    connection.end();
	    callback(Ingredient.SUCCESS_ADDED, null);
	});
    }

    /*
     * Checks whether an ingredient exists with the specified parameters passed into the constructor.
     * null parameters are treated as wild cards. username, ingredient_name, expiration_date cannot be null.
     * result will be a boolean that is true if it is found, and false otherwise.
     */
    this.contains = function(callback) {

    }

    /*
     * Sets the database that this object will connect to.
     *
     */

    this.setDatabaseModel = function(model) {

    }

    /*
     * Sets how the list returned by get is sorted by.
     *
     */
    this.setSort = function(sortby) {

    }
}

Ingredient.SUCCESS_ADDED = 1;
Ingredient.SUCCESS_UPDATED = 2;
Ingredient.NEGATIVE_QUANTITY = -1;
Ingredient.DATE_ERROR = -2;
Ingredient.ERROR = -3;


module.exports = Ingredient;