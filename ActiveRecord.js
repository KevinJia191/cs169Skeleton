/*
 * Abstract base class of all models.
 * The callback function taken by each function should be of the form
 * function(err, result); where err is an error message and result is the returned object representing the result.
*/

function ActiveRecord() {

    /*
     * Adds the record to the database set with setDatabaseModel.
     */
    this.add = function(callback) {
    }

    /*
     * Removes the records from the database set with setDatabaseModel.
     */
    this.remove = function(callback) {
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
     * Sets the database that this object will connect to.
     */
    this.setDatabaseModel = function(model) {

    }

    this.getDatabaseModel = function() {
    }

    this.setParser = function(parser) {
    }

    this.getParser = function() {
    }


    /*
     * Connect to the database. It must be set to call this, or it will fail.
     */
    this.connect = function() {
    }

    /*
     * End the connection started when connect is called.
     */
    this.end = function() {
    }

    /*
     * Sets how the list returned by get is sorted by. sortField is the field to sort on. sortBy is either "ASC" or "DESC" (ascending/descending). limit 
     *
     */
    this.setSort = function(sortField, sortBy, limit) {
    }
}