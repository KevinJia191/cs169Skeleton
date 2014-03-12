var pg = require('pg');

var HistoryController = function(request) {

    this.request = request;
    var SUCCESS = "SUCCESS";
    var dbERROR = "dbERROR";
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest, callback) { 
        var jsonObject = {};       
        
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("INSERT INTO HISTORY VALUES(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")", function(err, result){
                done();
                if(err){
                    console.error(err);
                    jsonObject.errCode = dbERROR;
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
        });
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest, callback) {
        var jsonObject = {};
        var user = postRequest.user;
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM history H WHERE username=\'" + user + "\'", function(err, result){
                done();
                if(err){
                    console.error(err);
                    jsonObject.errCode = dbERROR;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }
                jsonObject.user = user;
                jsonObject.userHistory = result.rows;
                jsonObject.errCode = SUCCESS;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            });
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest) {
        var jsonObject = {};
        
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("DELETE FROM HISTORY WHERE username=\' " + postRequest.user"\'", function(err, result){
                done();
                if(err){
                    console.error(err);
                    jsonObject.errCode = dbERROR;
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