var pg = require('pg');


//should extend the ActiveRecord class
function Recipe(username, recipe_name, date_created, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.date_created = date_created;
    this.rating = rating;
    
    this.make = function(callback) {
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

    this.remove = function(callback) {
    }

    this.get = function(callback){
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
    }

    this.setSort = function(sortby) {
    }
}