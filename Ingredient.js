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
    this.connnection = null;
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

    this.blahfish = function(result) {
	var ingredients = new Array();
	if (result.rows.length == 0) {
	    return ingredients;
	}
	for (index = 0; index < result.rows.length; index++) {
	    var rows = result.rows[index];
	    console.log("DB user:"+rows["user"]);
	    var ingredient = new Ingredient(rows["user"], rows["ingredient_name"], rows["expiration_date"], rows["quantity"], rows["unit"]);
	    ingredients[index] = ingredient;
	}
	return ingredients;
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
	var selectQuery = this.createSelectQuery();
	console.log(selectQuery);
	console.log("The username is: "+this.username);
	connection.connect();
	connection.query(selectQuery, function(err, result) {
	    console.log(err);
	    console.log("Result length: "+result.rows.length);
	    connection.end();
	    console.log(this.blahfish(result));
	    callback(Ingredient.SUCCESS_ADDED, null);
	});
    }

    this.createSelectQuery = function() {
	var addQuery = "select * from ingredients where ";
	var index = 0;
	var constraints = new Array();
	var isFirst = true;
	if (this.username != null) {
	    constraints[index] = "username " + " = " + "'" + this.username + "' ";
	    index = index + 1;
	}
	if (this.ingredient_name != null) {
	    constraints[index] =  "ingredient_name " + " = " + "'" + this.ingredient_name + "' ";
	    index = index + 1;
	}
	if (this.expiration_date != null) {
	    constraints[index] =  "expiration_date " + " = " + "'" + this.expiration_date + "' ";
	    index = index + 1;
	}
	for (index = 0; index < constraints.length; index++) {
	    if (!isFirst) {
		addQuery = addQuery + " AND ";
	    }
	    else {
		isFirst = false;
	    }
	    addQuery = addQuery + constraints[index];
	}
	return addQuery;
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
	this.connection = model;
    }

    this.getDatabaseModel = function() {
	return this.connection;
    }


    this.setParser = function(parser) {
    }

    this.getParser = function() {
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

Ingredient.prototype.toString = function() {
    var ret = "Ingredient is: "+this.ingredient_name+", and is owned by: "+this.username;
  return ret;
}


module.exports = Ingredient;