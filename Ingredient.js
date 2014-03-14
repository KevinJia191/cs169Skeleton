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
	var self = this;
	if (quantity < 0) {
	    callback(Ingredient.NEGATIVE_QUANTITY, null);
	    return;
	}
	this.get(function(err, result) {
	    // the item is not currently in the database, so we can directly insert it.
	    if (result.length == 0) { 
		var addQuery = "insert into ingredients values('"+self.username+"', '"+self.ingredient_name+"','"+self.expiration_date+"', '"+self.quantity+"', '"+self.unit+"')";
		console.log(addQuery);
		self.connection.query(addQuery, function(err, result) {
		    console.log("Error:"+err);
		    callback(Ingredient.SUCCESS_ADDED, null);
		});
	    }
	    // ingredient is already in the db, so update its quantity
	    else {
		var newQuantity = result[0]["quantity"] + this.quantity;
		var updateQuery = "update ingredients set quantity ="+newQuantity+"where username = '"+self.username+"' AND ingredient_name = '"+self.ingredient_name+"' AND expiration_date= '"+self.expiration_date+"'";
		self.connection.query(updateQuery, function(err, result) {
		    callback(Ingredient.SUCCESS_UPDATED, newQuantity);
		});
	    }
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
	var selectQuery = this.createSelectQuery();
	var self = this;
	this.connection.query(selectQuery, function(err, result) {
	    callback(Ingredient.SUCCESS, self.parseDBResult(result));
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
    
    this.parseDBResult = function(result) {
	var ingredients = new Array();
	if (result.rows.length == 0) {
	    return ingredients;
	}
	for (index = 0; index < result.rows.length; index++) {
	    var rows = result.rows[index];
	    var ingredient = new Ingredient(rows["username"], rows["ingredient_name"], rows["expiration_date"], rows["quantity"], rows["unit"]);
	    ingredients[index] = ingredient;
	}
	return ingredients;
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

    this.connect = function() {
	this.connection = new pg.Client(process.env.DATABASE_URL);
	this.connection.connect();
    }
    this.end = function() {
	this.connection.end();
    }

    /*
     * Sets how the list returned by get is sorted by.
     *
     */
    this.setSort = function(sortby) {

    }
}

Ingredient.SUCCESS = 3;
Ingredient.SUCCESS_ADDED = 1;
Ingredient.SUCCESS_UPDATED = 2;
Ingredient.NEGATIVE_QUANTITY = -1;
Ingredient.DATE_ERROR = -2;
Ingredient.ERROR = -3;



module.exports = Ingredient;