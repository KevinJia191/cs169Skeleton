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
    // numFields should never be 0.
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
	var self = this;
	var insertQuery = "insert into "+this.tableName+" values(";
	var count = 1;
	for (field in this.fields) {
	    if (count == this.numFields) {
		insertQuery = insertQuery + this.getValue(field, this.fields) + ")";
	    }
	    else {
		insertQuery = insertQuery + this.getValue(field, this.fields)+", ";
	    }
	    count = count + 1;
	}
	console.log(insertQuery);
	this.connection.query(insertQuery, function(err, result) {
	    callback(self.parser.parseError(err));
	});
    }

    /*
     * Removes the records from the database set with setDatabaseModel.
     */
    this.remove = function(callback) {
	var removeQuery = "delete from "+ this.tableName + " where "+this.createConstraints(this.fields);
	console.log(removeQuery);
	this.connection.query(removeQuery, function(err, result) {
	    callback(this.parse.parseError(err));
	});
    }

    this.update = function(callback, fields) {
	var self = this;
	var updateQuery = "update "+ this.tableName + " set " + this.createConstraints(fields) + "where " + this.createConstraints(this.fields);
	console.log(updateQuery);
	this.connection.query(updateQuery, function(err, result) {
	    callback(self.parser.parseError(err));
	});
    }

    /*
     * Gets the records from the database set with setDatabaseModel. result is  a list of matching
     * records that is not sorted unless a sort order is specified.
     */
    this.get = function(callback) {
    }

    /*
     * Checks if this record is in the database set with setDatabaseModel. result is true  if the specified
     * record exists, or otherwise false.
     */ 
    this.contains = function(callback) {
    }


    /*
     * Clears all specified records from the database.
     */
    this.clear = function(callback)  {

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
		console.log(query);
	    }
	}
	return query;
    }
}

module.exports = ActiveRecord;

