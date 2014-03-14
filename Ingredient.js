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
    this.sortField = null;
    this.sortBy = null;
    this.start = null;
    this.end = null;
    
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
		    callback(Ingredient.SUCCESS);
		});
	    }
	    // ingredient is already in the db, so update its quantity
	    else {
		var newQuantity = parseInt(result[0]["quantity"]) + self.quantity;
		var updateQuery = "update ingredients set quantity ="+newQuantity+" where "+self.createConstraints();
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
	var self = this;
	if (quantity < 0) {
	    callback(Ingredient.NEGATIVE_QUANTITY, null);
	    return;
	}
	this.get(function(err, result) {
	    // the item is not currently in the database, so we can't remove it
	    if (result.length == 0) { 
		callback(Ingredient.DOESNT_EXIST, null);
	    }
	    // ingredient is already in the db, so update its quantity
	    else {
		var newQuantity = parseInt(result[0]["quantity"]) - self.quantity;
		// remove the item
		if (newQuantity <= 0) {
		    var removeQuery = "delete from ingredients where "+self.createConstraints();
		    console.log(removeQuery);
		    self.connection.query(removeQuery, function(err, result) {
			callback(Ingredient.SUCCESS, null);
		    });
		}
		// decrease the quantity of the item
		else {
		    var updateQuery = "update ingredients set quantity ="+newQuantity+" where "+self.createConstraints();
		    self.connection.query(updateQuery, function(err, result) {
			callback(Ingredient.SUCCESS_UPDATED, newQuantity);
		    });
		}
	    }
	});
    }

    this.clear = function(callback) {
	var self = this;
	console.log("YO THIS RAN BRO");
	var removeQuery = "delete from ingredients where "+self.createConstraints();
	console.log(removeQuery);
	self.connection.query(removeQuery, function(err, result) {
	    callback(Ingredient.SUCCESS, null);
	});
    }

    /*
     * Gets the ingredient with the specified parameters passed into the constructor. 
     * For example, if you only specify username and all other fields are null,
     * then all ingredients possessed by that user will be stored in result.
     * result will be a list of ingredients. If sortby was set, the list will be sorted, otherwise order
     * is not guaranteed. If start and end are not set, all returned records are fair game.
     */
    this.get = function(callback) {
	var selectQuery = "select * from ingredients where " + this.createConstraints();
	var self = this;
	if (this.sortField != null) {
	    selectQuery = selectQuery + " order by "+this.sortfield;
	    if (this.sortBy != null) {
		selectQuery = selectQuery + " "+this.sortBy;
	    }
	}
	this.connection.query(selectQuery, function(err, result) {
	    callback(Ingredient.SUCCESS, self.parseDBResult(result));
	});
    }

    this.createConstraints = function() {
	var query = "";
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
		query = query + " AND ";
	    }
	    else {
		isFirst = false;
	    }
	    query = query + constraints[index];
	}
	return query;
    }
    
    this.parseDBResult = function(result) {
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
     * Sets how the list returned by get is sorted by. sortField is the field to sort on. sortBy is either "ASC" or "DESC" (ascending/descending).
     * Display the inventory starting from the start to end element.
     */
    this.setSort = function(sortField, sortBy, start, end) {
	this.sortField = sortField;
	this.sortBy = sortBy;
	this.limit = limit;
    }
}

Ingredient.SUCCESS = 3;
Ingredient.SUCCESS_ADDED = 1;
Ingredient.SUCCESS_UPDATED = 2;
Ingredient.NEGATIVE_QUANTITY = -1;
Ingredient.DATE_ERROR = -2;
Ingredient.ERROR = -3;
Ingredient.DOESNT_EXIST = -4;



module.exports = Ingredient;