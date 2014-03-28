var pg = require('pg');
var Constants = require('./Constants.js');
var ActiveRecord = require('./ActiveRecord.js');
/*
* Model for an ingredient. username, ingredient_name, expiration_date are primary keys.
* All methods in here have a callback function of format function(err, result);
* A database model must be set in order to execute add, remove, etc.
* @author Christopher
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



    this.userExists = function(callback) {
	var self = this;
	var userRecord = new ActiveRecord();
	userRecord.setUp(self.connection, self.parser, Constants.USERS_TABLE);
	userRecord.put("username", self.username);
	userRecord.select(function(err, result) {
	    console.log(err);
	    if (err) {
		callback(Constants.ERROR);
		return;
	    }
	    result = self.parser.parseIngredient(result);
	    if (result.length == 0) {
		callback(Constants.INVALID_USER);
	    }
	    else {
		callback(Constants.SUCCESS);
	    }
	});
    }


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
	self.userExists(function(err) {
	    if (err != Constants.SUCCESS) {
		callback(err);
		return;
	    }
	    var ingredientRecord = new ActiveRecord();
	    ingredientRecord.setUp(self.connection, self.parser, Constants.INGREDIENTS_TABLE);
	    ingredientRecord.put("username", self.username);
	    ingredientRecord.put("ingredient_name", self.ingredient_name);
	    ingredientRecord.put("expiration_date", self.expiration_date);
	    ingredientRecord.select(function(err, result) {
		if (err) {
		    callback(Constants.ERROR);
		    return;
		}
		result = self.parser.parseIngredient(result);
		// the item is not currently in the database, so we can directly insert it.
		if (result.length == 0) {
		    ingredientRecord.put("unit", self.unit);
		    ingredientRecord.put("quantity", self.quantity);
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
		else if (result.length == 1) {
		    var newQuantity = parseInt(result[0]["quantity"]) + self.quantity;
		    ingredientRecord.put("username", self.fields.username);
		    ingredientRecord.put("ingredient_name", self.fields.ingredient_name);
		    ingredientRecord.put("expiration_date", self.fields.expiration_date);
		    ingredientRecord.update(function(err, result) {
			if (err) {
			    callback(Constants.ERROR);
			}
			else {
			    callback(Constants.SUCCESS_UPDATED, newQuantity);
			}
		    }, {"quantity":newQuantity});
		}
		// more than one ingredient matched: this is an error
		else {
		    callback(Constants.ERROR);
		}
	    });
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
	self.userExists(function(err) {
	    if (err != Constants.SUCCESS) {
		callback(err);
		return;
	    }
	    var ingredientRecord = new ActiveRecord();
	    ingredientRecord.setDatabaseModel(self.connection);
	    ingredientRecord.setParser(self.parser);
	    ingredientRecord.setTable(Constants.INGREDIENTS_TABLE);
	    ingredientRecord.put("username", self.username);
	    ingredientRecord.put("ingredient_name", self.ingredient_name);
	    ingredientRecord.put("expiration_date", self.expiration_date);
	    ingredientRecord.select(function(err, result) {
		if (err) {
		    callback(Constants.ERROR);
		    return;
		}
		result = self.parser.parseIngredient(result);
		if (result.length == 0) { 
		    callback(Constants.DOESNT_EXIST, null);
		}
		else { // ingredient is already in the db, so update its quantity
		    var newQuantity = parseInt(result[0]["quantity"]) - self.quantity;
		    console.log(newQuantity);
		    if (newQuantity <= 0) {
			ingredientRecord.remove(function(err, result) {
			    if (err) {
				callback(Constants.ERROR);
			    }
			    else {
				callback(Constants.SUCCESS);
			    }
			});
		    }
		    else {
			ingredientRecord.update(function(err, result) {
			    if (err) {
				callback(Constants.ERROR);
			    }
			    else {
				callback(Constants.SUCCESS_UPDATED, newQuantity);
			    }
			}, {"quantity":newQuantity});
		    }
		}
	    });
	});
    }



    this.removeAll = function(callback) {
	var self = this;
	self.userExists(function(err) {
	    if (err != Constants.SUCCESS) {
		callback(err);
		return;
	    }
	    var ingredientRecord = new ActiveRecord();
	    ingredientRecord.setDatabaseModel(self.connection);
	    ingredientRecord.setParser(self.parser);
	    ingredientRecord.setTable(Constants.INGREDIENTS_TABLE);
	    ingredientRecord.put("username", self.username);
	    ingredientRecord.remove(function(err, result) {
		if (err) {
		    callback(Constants.ERROR);
		}
		else {
		    callback(Constants.SUCCESS);
		}
	    });
	});
    }

    this.removeIngredient = function(callback) {
	var self = this;
	self.userExists(function(err) {
	    if (err != Constants.SUCCESS) {
		callback(err);
		return;
	    }
	    var ingredientRecord = new ActiveRecord();
	    ingredientRecord.setDatabaseModel(self.connection);
	    ingredientRecord.setParser(self.parser);
	    ingredientRecord.setTable(Constants.INGREDIENTS_TABLE);
	    ingredientRecord.put("username", self.username);
	    ingredientRecord.put("ingredient_name", self.ingredient_name);
	    ingredientRecord.put("expiration_date", self.expiration_date);
	    ingredientRecord.remove(function(err, result) {
		if (err) {
		    callback(Constants.ERROR);
		}
		else {
		    callback(Constants.SUCCESS);
		}
	    });
	});
    }
    
    this.getInventory = function(callback) {
	var self = this;
	self.userExists(function(err) {
	    if (err != Constants.SUCCESS) {
		callback(err);
		return;
	    }
    	    var ingredientRecord = new ActiveRecord();
	    ingredientRecord.setDatabaseModel(self.connection);
	    ingredientRecord.setParser(self.parser);
	    ingredientRecord.setTable(Constants.INGREDIENTS_TABLE);
	    ingredientRecord.put("username", self.username);
	    ingredientRecord.select(function(err, result) {
		if (err) {
		    callback(Constants.ERROR);
		}
		else {
		    callback(Constants.SUCCESS, self.parser.parseIngredient(result));
		}
	    });
	});
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