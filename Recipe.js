var pg = require('pg');

//should extend the ActiveRecord class
function Recipe(username, recipe_name, date_created, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.date_created = date_created;
    this.rating = rating;
    this.connection=null;
    
    this.make = function(postRequest, callback) {
        var jsonObject = {};     
        
        var testUserQuery = "SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'"
        var testAlreadyMadeQuery = "SELECT * FROM history H WHERE username=\'" + postRequest.user + "\'" + "AND recipe_name=\'" + postRequest.recipe_name + "\'" + "AND current_date=" + postRequest.current_date
        var makeQuery = "INSERT INTO HISTORY VALUES(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")"
        
        this.connection.query(testUserQuery, function(err, result){
            if(result.rows.length>0){
                this.connection.query(testAlreadyMadeQuery, function(err, result){
                    if(result.rows.length == 0){
                        //Did not fail already made today check
                        this.connection.query(makeQuery, function(err, result){
                            done();
                            if(err){
                                console.error(err);
                                jsonObject.errCode = ERROR;
                                var jsonForm = JSON.stringify(jsonObject);
                                callback(jsonForm);
                                return;
                            }
                            jsonObject.errCode = SUCCESS;
                            var madeEntry = "(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")";
                            jsonObject.madeEntry = madeEntry;
                            var jsonForm = JSON.stringify(jsonObject);
                            callback(jsonForm);
                            return;
                        });
                    }
                    else{
                        jsonObject.errCode = ERR_CREATED_ALREADY;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                });
            }
            else{
                jsonObject.errCode = INVAL_USER;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
    }

    this.clearAllHistoryFromUser = function(postRequest, callback) {
        var jsonObject = {};
        this.connection.query("DELETE FROM HISTORY WHERE username=\' " + postRequest.user + "\'", function(err, result){
            done();
            if(err){
                console.error(err);
                jsonObject.errCode = ERROR;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            
            jsonObject.errCode = SUCCESS;
            jsonObject.deletedEntry = "deletedAll";
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
        });
    }

    this.getAllHistoryFromUser = function(postRequest, callback){
        this.connection.query("SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'", function(err, result){
            if(result.rows.length > 0){
                this.connection.query("SELECT * FROM history H WHERE username=\'" + postRequest.user + "\'", function(err, result){
                    done();
                    if(err){
                        console.error(err);
                        jsonObject.errCode = ERROR;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                    jsonObject.userHistory = result.rows;
                    jsonObject.errCode = SUCCESS;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                });
            }
            else{
                jsonObject.errCode = INVAL_USER;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
    
    this.connect = function() {
        this.connection = new pg.Client(process.env.DATABASE_URL);
        this.connection.connect();
    }
    
    this.end = function(){
        this.connection.end();
    }
}
module.exports = Recipe;