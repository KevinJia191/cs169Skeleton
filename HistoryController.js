var pg = require('pg');

var HistoryController = function(request) {

    this.request = request;
    var SUCCESS = "SUCCESS";
    var INVAL_USER = "INVAL_USER"
    var ERR_CREATED_ALREADY = "ERR_CREATED_ALREADY";
    var ERROR = "ERROR";
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest, callback) { 
        var jsonObject = {};       
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'", function(err, result){
                if(result.rows.length>0){
                    client.query("SELECT * FROM history H WHERE username=\'" + postRequest.user + "\'" + "AND recipe_name=\'" + postRequest.recipe_name + "\'" + "AND current_date=" + postRequest.current_date, function(err, result){
                        if(result.rows.length == 0){
                            //Did not fail already made today check
                            client.query("INSERT INTO HISTORY VALUES(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")", function(err, result){
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
        });
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest, callback) {
        var jsonObject = {};
        var user = postRequest.user;
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'", function(err, result){
                if(result.rows.length > 0){
                    client.query("SELECT * FROM history H WHERE username=\'" + user + "\'", function(err, result){
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
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest, callback) {
        var jsonObject = {};
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("DELETE FROM HISTORY WHERE username=\' " + postRequest.user + "\'", function(err, result){
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
        });
    }
}


module.exports = HistoryController;