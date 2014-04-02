var pg = require('pg');
var Constants = require('./Constants.js');
var ActiveRecord = require('./ActiveRecord.js');
var RatingRecord = require('./RatingRecord.js');
var UserRecord = require('./UserRecord.js');
/*
Model for "Rating" element, primary key'd by username, recipe_name, rating
*/
function RatingModel(username, recipe_name, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.rating = rating;
    
    this.connection = null;
    this.parser = null;
    
    this.sortField = null;
    this.sortBy = null;
    this.limit = null;

    
    this.fields = {"username": username, "recipe_name":recipe_name, "rating":rating};
    
    this.rate = function(callback) {
        //If the user exists
        var self = this;
        self.userExists(function(err) {
            if (err != Constants.SUCCESS) {
                callback(err);
                return;
            }
            var ratingRecord = new RatingRecord(self.username, self.recipe_name, self.rating);
            ratingRecord.setUp(self.connection, self.parser);
            //If rating on this recipe has already been made
            ratingRecord.select(function(err, result) {
                if (err) {
                    console.log(err);
                    callback(Constants.ERROR);
                    return;
                }
                else{
                    result = self.parser.parseRating(result);
                    // Object has never been made before on this day
                    if (result.length == 0) {
                        if(self.rating >= 1 && self.rating <= 5){
                            ratingRecord.insert(function(err, result) {
                                if (err) {
                                    callback(Constants.ERROR);
                                    return;
                                }
                                else {
                                    callback(Constants.SUCCESS);
                                    return;
                                }
                            });
                        }
                        else{
                            console.log(result.rating);
                            callback(Constants.INVALID_RATING);
                            return;
                        }
                    }
                    else{//result.length==1, meaning recipe has already been previously rated
                        if(result.rating != self.rating){
                            if(self.rating >= 1 && self.rating <= 5){
                                ratingRecord.insert(function(err, result) {
                                    if (err) {
                                        callback(Constants.ERROR);
                                        return;
                                    }
                                }); 
                            }
                            else{
                                callback(Constants.INVALID_RATING);
                                return;
                            }
                        }
                        callback(Constants.SUCCESS);
                        return;
                    }
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
module.exports = RatingModel;