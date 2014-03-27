/*
 * Abstract base class of all models.
 * The callback function taken by each function should be of the form
 * function(err, result); where err is an error message and result is the returned object representing the result.
*/

function ActiveRecord() {
    this.fields = {};
    this.tableName = null;
    this.connection = null;
    this.parser = null;
    this.numFields = 0;


    this.put = function(key, value) {
	this.fields[key] = value;
	this.numFields = this.numFields + 1;
    }

    this.setTable = function(name) {
	this.tableName = name;
    }

    /*
     * Adds the record to the database. No fields of the record should be null.
     */
    this.insert = function(callback) {
	if (this.numFields == 0) {
	    callback(DatabaseModel.ERROR);
	    return;
	}
	var self = this;
	var insertQuery = "insert into "+this.tableName;
	var values = " values(";
	var columns = " (";
	var count = 1;
	for (field in this.fields) {
	    if (count == this.numFields) {
		values = values + this.getValue(field, this.fields) + ")";
		columns = columns + field + ")";
	    }
	    else {
		values = values + this.getValue(field, this.fields)+", ";
		columns = columns + field + ", ";
	    }
	    count = count + 1;
	}
	insertQuery = insertQuery + columns + values;
	console.log(insertQuery);
	this.connection.query(insertQuery, function(err, result) {
	    callback(self.parser.parseError(err));
	});
    }

    /*
     * Removes all records from the database matching having the given fields. Null fields are treated as wildcards.
     */
    this.remove = function(callback) {
	var self = this;
	var removeQuery = "delete from "+ this.tableName + " where "+this.createConstraints(this.fields);
	console.log(removeQuery);
	this.connection.query(removeQuery, function(err, result) {
	    callback(self.parser.parseError(err));
	});
    }

    /*
     * Updates the associated record in the database. 
     * fields is a json of key, value pairs, such that each specified key will updated to its respective value.
     */
    this.update = function(callback, fields) {
	var self = this;
	var updateQuery = "update "+ this.tableName + " set " + this.createConstraints(fields) + "where " + this.createConstraints(this.fields);
	console.log(updateQuery);
	this.connection.query(updateQuery, function(err, result) {
	    callback(self.parser.parseError(err));
	});
    }

    /*
     * Selects all records from the database exactly matching the fields of this record ordered by the specified sort. Null fields are treated as wildcards.
     */
    this.select = function(callback) {
	var self = this;
	var selectQuery = "select * from " + this.tableName  +" where "+this.createConstraints(this.fields);
	console.log(selectQuery);
	this.connection.query(selectQuery, function(err, result) {
	    callback(self.parser.parseError(err), result);
	});
    }


    /*
     * Sets the database that this object will connect to.
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
     *
     */
    this.setSort = function(sortField, sortBy, start, end) {
    }


    /**
     * ==================================
     * ==================================
     *         Private Methods
     * ==================================
     * ==================================
     */
    this.getValue =  function(field, fields) {
	if (typeof(fields[field]) == "string") {
	    return "'"+fields[field]+"'";
	}
	else {
	    return fields[field];
	}
    }
    this.createConstraints = function(fields) {
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
		query = query + field + " = " + this.getValue(field, fields) + " ";
	    }
	}
	return query;
    }
}

module.exports = ActiveRecord;

