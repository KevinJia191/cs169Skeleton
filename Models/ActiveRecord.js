/*
* Base class of relations stored in a database. Each ActiveRecord has an analogous representation in a database as a record. 
* Classes that extend ActiveRecord will have their constructors take in fields that correspond to the columns of its respective 
* table in the database.
* @author Christopher
*/
function ActiveRecord() {
    this.fields = {};
    this.constraints = {}; //field maps a field name to the constraint applied on it
    this.tableName = null;
    this.connection = null;
    this.parser = null;
    this.numFields = 0;
    this.sortField = null;
    this.order = null;
    this.constraintDict = {} 
    this.constraintDict[ActiveRecord.EQUAL] = true;
    this.constraintDict[ActiveRecord.NOT_EQUAL] = true;
    this.constraintDict[ActiveRecord.LESS_THAN] = true;
    this.constraintDict[ActiveRecord.GREATER_THAN] = true;
    this.constraintDict[ActiveRecord.LESS_THAN_OR_EQ] = true;
    this.constraintDict[ActiveRecord.GREATER_THAN_OR_EQ] = true;
}


ActiveRecord.prototype.put = function(key, value) {
    if (value == undefined) {
	value = null;
    }
    this.fields[key] = value;
    this.constraints[key] = ActiveRecord.EQUAL;
}


/*
 * Adds the record to the database. No fields of the record should be null.
 */
ActiveRecord.prototype.insert = function(callback) {
    if (this.numFields == 0) {
	callback(DatabaseModel.ERROR);
	return;
    }
    var self = this;
    var insertQuery = "insert into "+this.tableName;
    var values = " values(";
    var columns = " (";
    var count = 1;
    var fieldCount = 0;
    for (field in this.fields) {
	if (this.fields[field] != null) {
	    fieldCount = fieldCount + 1;
	}
    }
    for (field in this.fields) {
	if (this.fields[field]) {
	    if (count == fieldCount) {
		values = values + this.getValue(field, this.fields) + ")";
		columns = columns + field + ")";
	    }
	    else {
		values = values + this.getValue(field, this.fields)+", ";
		columns = columns + field + ", ";
	    }
	    count = count + 1;
	}
    }
    insertQuery = insertQuery + columns + values;
    console.log(insertQuery);
    this.connection.query(insertQuery, function(err, result) {
	callback(self.parser.parseError(err));
    });
}

ActiveRecord.EQUAL = "=";
ActiveRecord.LESS_THAN = "<";
ActiveRecord.GREATER_THAN = ">";
ActiveRecord.LESS_THAN_OR_EQ = "<=";
ActiveRecord.GREATER_THAN_OR_EQ = ">=";
ActiveRecord.NOT_EQUAL = "!=";

/*
 * Removes all records from the database matching having the given fields. Null fields are treated as wildcards.
 */
ActiveRecord.prototype.remove = function(callback) {
    var self = this;
    var removeQuery = "delete from "+ this.tableName;
    if (this.hasConstraints(this.fields)) {
	removeQuery = removeQuery + " where " + this.createConstraints(this.fields);
    }
    console.log(removeQuery);
    this.connection.query(removeQuery, function(err, result) {
	callback(self.parser.parseError(err));
    });
}

/*
 * Updates the associated record in the database. 
 * fields is a json of key, value pairs, such that each specified key will updated to its respective value.
 */
ActiveRecord.prototype.update = function(callback, fields) {
    var self = this;
    var updateQuery = "update "+ this.tableName + " set " + this.createConstraints(fields);
    if (this.hasConstraints(this.fields)) {
	updateQuery = updateQuery + " where " + this.createConstraints(this.fields);
    }
    console.log(updateQuery);
    this.connection.query(updateQuery, function(err, result) {
	callback(self.parser.parseError(err));
    });
}

/*
 * Selects all records from the database exactly matching the fields of this record ordered by the specified sort. Null fields are treated as wildcards.
 */
ActiveRecord.prototype.select = function(callback) {
    var self = this;
    var selectQuery = "select * from " + this.tableName;
    if (this.hasConstraints(this.fields)) {
	selectQuery = selectQuery + " where " + this.createConstraints(this.fields);
    }
    if (this.sortField != null) {
	selectQuery = selectQuery + "order by "+this.sortField;
	if (this.order != null) { 
	    selectQuery = selectQuery + " " + this.order;
	}
    }
    console.log(selectQuery);
    this.connection.query(selectQuery, function(err, result) {
	callback(self.parser.parseError(err), result);
    });
}

/*
 * Sets the database that this object will connect to.
 */
ActiveRecord.prototype.setDatabaseModel = function(model) {
    this.connection = model;
}

ActiveRecord.prototype.getDatabaseModel = function() {
    return this.connection;
}

ActiveRecord.prototype.setParser = function(parser) {
    this.parser = parser;
}

ActiveRecord.prototype.getParser = function() {
    return this.parser;
}

ActiveRecord.prototype.setTable = function(name) {
    this.tableName = name;
}

ActiveRecord.prototype.getTable = function() {
    return this.tableName;
}

ActiveRecord.prototype.setUp = function(model, parser) {
    this.setDatabaseModel(model);
    this.setParser(parser);
}

/*
 * Sets how the list returned by get is sorted by. sortField is the field to sort on. sortBy is either "ASC" or "DESC" (ascending/descending).
 *
 */
ActiveRecord.prototype.sort = function(field, order) {
    if (field != null && this.fields.hasOwnProperty(field)) {
	this.sortField = field;
    }
    else {
	return false;
    }
    if (order == "ASC" || order == "DESC") {
	this.order = order;
	return true;
    }
    else {
	return false;
    }
}

/**
 * ==================================
 * ==================================
 *         Private Methods
 * ==================================
 * ==================================
 */
ActiveRecord.prototype.getValue =  function(field, fields) {
    if (typeof(fields[field]) == "string") {
	return "'"+fields[field]+"'";
    }
    else {
	return fields[field];
    }
}

ActiveRecord.prototype.getConstraint = function(field) {
    if (this.fields.hasOwnProperty(field)) {
	return this.constraints[field];
    }
    else {
	return null;
    }
}


ActiveRecord.prototype.hasConstraints = function(fields) {
    for (field in fields) {
	if (fields[field] != null) {
	    return true;
	}
    }
    return false;
}

ActiveRecord.prototype.createConstraints = function(fields) {
    var query = "";
    var isFirst = true;
    for (field in fields) {
	if (fields[field] != null) {	    
	    if (!isFirst) {
		query = query + "AND ";
	    }
	    else {
		isFirst = false;
	    }
	    query = query + field + " " + this.getConstraint(field) +  " " + this.getValue(field, fields) + " ";
	}
    }
    return query;
}

module.exports = ActiveRecord;

