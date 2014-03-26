var pg = require('pg');
var Constants = require('./Constants.js');
var ActiveRecord = require('./ActiveRecord.js');
/*
* Model for an ingredient. username, ingredient_name, expiration_date are primary keys.
* All methods in here have a callback function of format function(err, result);
* A database model must be set in order to execute add, remove, etc.
*@author Christopher
*/
function Ingredient(username, ingredient_name, expiration_date, quantity, unit){
    this.username = username;
    this.ingredient_name = ingredient_name;
    this.expiration_date = expiration_date;
    this.quantity = quantity;
    this.unit = unit;
    this.connnection = null;
    this.parser = null;
    this.sortField = null;
    this.sortBy = null;
    this.start = null;
    this.end = null;
    this.validUnits = { "oz" : true, "count": true};
    this.fields = { "username": username, "ingredient_name":ingredient_name, "expiration_date":expiration_date, "quantity":quantity, "unit":unit};
    // null means conversion isn't allowed. This contains all combinations where [a,b] means that a is lexicographically less than b.
    this.conversion = {"count/oz": null} 
    /* 
     * Adds the ingredient to the User's inventory.
     * These fields CANNOT be null: username, ingredient_name, expiration_date, quantity, unit
     * result will be null if the ingredient was not previously present, or the updated amount of
     * the ingredient.
     */
    this.add = function(callback) {
	var self = this;
	if (quantity < 0) {
	    callback(Constants.NEGATIVE_QUANTITY, null);
	    return;
	}
	var ingredientRecord = new ActiveRecord();
	ingredientRecord.setDatabaseModel(this.connection);
	ingredientRecord.setParser(this.parser);
	ingredientRecord.setTable(Constants.INGREDIENTS_TABLE);
	this.get(function(err, result) {
	    // the item is not currently in the database, so we can directly insert it.
	    if (result.length == 0) {
		for (field in self.fields) {
		    ingredientRecord.put(field, self.fields[field]);
		}
		ingredientRecord.insert(function(err, result) {
		    if (err) {
			callback(Constants.ERROR);
		    }
		    else {
			callback(Constants.SUCCESS);
		    }
		});
	    }
	    // ingredient is already in the database, so update its quantity
	    else {
		var newQuantity = parseInt(result[0]["quantity"]) + self.quantity;
		ingredientRecord.put("username", self.fields.username);
		ingredientRecord.put("ingredient_name", self.fields.ingredient_name);
		ingredientRecord.put("expiration_date", self.fields.expiration_date);
		ingredientRecord.put("unit", null);
		ingredientRecord.put("quantity", null);
		ingredientRecord.update(function(err, result) {
		    if (err) {
			callback(Constants.ERROR);
		    }
		    else {
			callback(Constants.SUCCESS_UPDATED, newQuantity);
		    }
		}, {"quantity":newQuantity});
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
	    callback(Constants.NEGATIVE_QUANTITY, null);
	    return;
	}
	this.get(function(err, result) {
	    // the item is not currently in the database, so we can't remove it
	    if (result.length == 0) { 
		callback(Constants.DOESNT_EXIST, null);
	    }
	    // ingredient is already in the db, so update its quantity
	    else {
		var newQuantity = parseInt(result[0]["quantity"]) - self.quantity;
		// remove the item
		if (newQuantity <= 0) {
		    var removeQuery = "delete from ingredients where "+self.createConstraints();
		    console.log(removeQuery);
		    self.connection.query(removeQuery, function(err, result) {
			if (err) {
			    callback(Constants.ERROR);
			    return;
			}
			callback(Constants.SUCCESS, null);
		    });
		}
		// decrease the quantity of the item
		else {
		    var updateQuery = "update ingredients set quantity ="+newQuantity+" where "+self.createConstraints();
		    self.connection.query(updateQuery, function(err, result) {
			if (err) {
			    callback(Constants.ERROR);
			    return;
			}
			callback(Constants.SUCCESS_UPDATED, newQuantity);
		    });
		}
	    }
	});
    }

    /*
     * Clears all records that match the given constraints on primary key fields. For example you can delete all records for someone of a given username, or
     * delete all records of a given username and a given ingredient name. Warning: if all primary key fields are null, the whole database will be cleared.
     */
    this.clear = function(callback) {
	var self = this;
	var removeQuery = "delete from ingredients where "+self.createConstraints();
	console.log(removeQuery);
	self.connection.query(removeQuery, function(err, result) {
	    callback(Constants.SUCCESS, null);
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
	console.log(selectQuery);
	var self = this;
	if (this.sortField != null) {
	    selectQuery = selectQuery + " order by "+this.sortfield;
	    if (this.sortBy != null) {
		selectQuery = selectQuery + " "+this.sortBy;
	    }
	}
	this.connection.query(selectQuery, function(err, result) {
	    var x = self.parser.parseIngredient(result);
	    callback(Constants.SUCCESS, x);
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
	this.parser = parser;
    }

    this.getParser = function() {
	return this.parser;
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


module.exports = Ingredient;