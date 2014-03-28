/*
* Base class of relations stored in a database. Each ActiveRecord has an analogous representation in a database as a record. 
* Classes that extend ActiveRecord will have their constructors take in fields that correspond to the columns of its respective 
* table in the database.
* @author Christopher
*/

function ActiveRecord() {
    this.fields = {};
    this.tableName = null;
    this.connection = null;
    this.parser = null;
    this.numFields = 0;
    this.sortField = null;
    this.sortBy = null;

    this.put = function(key, value) {
	this.fields[key] = value;
	this.numFields = this.numFields + 1;
    }

    this.puts = function(pairs) {
	for (key in pairs) {
	    fields[key] = pairs[key];  
	}
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
	if (this.sortField != null) {
	    selectQuery = selectQuery + "order by "+this.sortField;
	    if (this.sortBy != null) { 
		selectQuery = selectQuery + " " + this.sortBy;
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

    this.setTable = function(name) {
	this.tableName = name;
    }
    
    this.getTable = function() {
	return this.tableName;
    }

    this.setUp = function(model, parser, tableName) {
	this.setDatabaseModel(model);
	this.setParser(parser);
	this.setTable(tableName);
    }
    /*
     * Sets how the list returned by get is sorted by. sortField is the field to sort on. sortBy is either "ASC" or "DESC" (ascending/descending).
     *
     */
    this.setSort = function(sortField, sortBy) {
	if (this.fields.hasOwnProperty(sortField)) {
	    this.sortField = sortField;
	}
	else {
	    return false;
	}
	if (sortBy == "ASC" || sortBy == "DESC") {
	    this.sortBy = sortBy;
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

