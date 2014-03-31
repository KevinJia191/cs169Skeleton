var pg = require('pg');
var Constants = require('./Constants.js');
var ActiveRecord = require('./ActiveRecord.js');
var RecipeRecord = require('./RecipeRecord.js');
var UserRecord = require('./UserRecord.js');
/*
Model for a "History" element : primary key'd by (username, recipe_name, dateCreated)
*/
function Recipe(username, recipe_name, dateCreated){
    this.username = username;
    this.recipe_name = recipe_name;
    this.dateCreated = dateCreated;
    
    this.connection = null;
    this.parser = null;
    
    this.sortField = null;
    this.sortBy = null;
    this.limit = null;

    
    this.fields = {"username": username, "recipe_name":recipe_name, "dateCreated":dateCreated};

    
    /*
    Make's this Recipe object and inserts into a user's history table
    */
    this.make = function(callback) {
        //If the user exists
        var self = this;
        self.userExists(function(err) {
            if (err != Constants.SUCCESS) {
                callback(err);
                return;
            }
            var recipeRecord = new RecipeRecord(self.username, self.recipe_name, self.dateCreated);
            recipeRecord.setUp(self.connection, self.parser);
            //If Object has already been made before on this day
            recipeRecord.select(function(err, result) {
                if (err) {
                    console.log("LOOK KEVIN LOOK KEVIN HERE IT IS: " + err);
                    callback(Constants.ERROR);
                    return;
                }
                else{
                    result = self.parser.parseIngredient(result);
                    // Object has never been made before on this day
                    if (result.length == 0) {
                        recipeRecord.insert(function(err, result) {
                            if (err) {
                                callback(Constants.ERROR);
                            }
                            else {
                                callback(Constants.SUCCESS);
                            }
                        });
                    }
                    else{
                        callback(Constants.ERR_RECIPE_CREATED_ALREADY);
                    }
                }
            });
        });
    }

    this.clearAllHistoryFromUser = function(callback) {
        var self = this;
        self.userExists(function(err) {
            if (err != Constants.SUCCESS) {
                callback(err);
                return;
            }
            var recipeRecord = new RecipeRecord(self.username);
            recipeRecord.setUp(self.connection, self.parser);
            recipeRecord.remove(function(err, result) {
                if (err) {
                    callback(Constants.ERROR);
                }
                else {
                    callback(Constants.SUCCESS);
                }
            });
        });
    }

    this.getAllHistoryFromUser = function(callback){
        var self = this;
        self.userExists(function(err) {
            if (err != Constants.SUCCESS) {
                callback(err);
                return;
            }
            var recipeRecord = new RecipeRecord(self.username);
            recipeRecord.setUp(self.connection, self.parser);
            recipeRecord.select(function(err, result) {
                if (err) {
                    callback(Constants.ERROR);
                }
                else {
                    callback(Constants.SUCCESS, self.parser.parseHistory(result));
                }
            });
        });
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
    
    this.setParser = function(parser) {
        this.parser = parser;
    }

    this.getParser = function() {
        return this.parser;
    }
    
    this.end = function(){
        this.connection.end();
    }
    
    this.setSort = function(sortField, sortBy, start, end) {
        this.sortField = sortField;
        this.sortBy = sortBy;
        this.limit = limit;
    }
    
    
    this.userExists = function(callback) {
        var self = this;
        var userRecord = new UserRecord(this.username);
        userRecord.setUp(self.connection, self.parser);
        userRecord.select(function(err, result) {
            //console.log(err);
            if (err) {
                callback(Constants.ERROR);
                return;
            }
            
            var queryResult = self.parser.parseUser(result);
            if (queryResult.length == 0) {
                callback(Constants.INVALID_USER);
                return;
            }
            else {
                callback(Constants.SUCCESS);
                return;
            }
        });
    }
}
module.exports = Recipe;