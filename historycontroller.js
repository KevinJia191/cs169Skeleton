var pg = require('pg');

var HistoryController = function(request) {

    this.request = request;
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest, callback) {
        var jsonObject = {errCode : 1};
        var jsonForm = JSON.stringify(jsonObject);
        callback(jsonForm);
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest, callback) {
        var jsonObject = {errCode : 1};
        var user = postRequest.user;
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM history H WHERE username=\'" + user + "\'", function(err, result){
                done();
                if(err) return console.error(err);
                jsonObject.user = user;
                jsonObject.userHistory = result.rows;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
            });
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest) {
        return {errCode : 1};
    }
}


module.exports = HistoryController;