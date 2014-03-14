var HistoryController = require('../HistoryController.js');

var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

exports['makeErrorCodetest'] = function (test) {
    var stubJson = {user : "testUser",
                    recipe_name : "Onion Soup",
                    current_date : "2/2/2",
                    rating : 3
                   };

    
    var unitTesting = true;
	var historyController = new HistoryController(null, unitTesting);
    
    //Sets up DB if never called before, else does nothing
    historyController.unitTestSetup();

    historyController.make(stubJson, function(resultingJson){
        //console.log(resultingJson);
        var errCodeNameLength = "{\"errCode\":".length;
        var errCodeStringPos = (resultingJson.indexOf("errCode"));
        var temp = (resultingJson.substr(1+errCodeNameLength, resultingJson.length)).indexOf("\"");
        //console.log((resultingJson.substr(1+errCodeNameLength, resultingJson.length)));
        var errCode = resultingJson.substr(1+errCodeNameLength,temp);

        //console.log("errCode is " + errCode);
        //console.log(errCode == "SUCCESS");
        test.equal(errCode, "SUCCESS", "ERRCODE WAS NOT SUCCESS");
        test.done();
    });
    
};

exports['maketest'] = function (test) {
    var stubJson = {user : "user1",
                    recipe_name : "Onion Soup",
                    current_date : "2/2/2",
                    rating : 3
                   };

    
    var unitTesting = true;
	var historyController = new HistoryController(null, unitTesting);
    
    //Sets up DB if never called before, else does nothing
    historyController.unitTestSetup();

    historyController.make(stubJson, function(resultingJson){
        //console.log(resultingJson);
        var errCodeNameLength = "{\"errCode\":".length;
        var errCodeStringPos = (resultingJson.indexOf("errCode"));
        var temp = (resultingJson.substr(1+errCodeNameLength, resultingJson.length)).indexOf("\"");
        //console.log((resultingJson.substr(1+errCodeNameLength, resultingJson.length)));
        var errCode = resultingJson.substr(1+errCodeNameLength,temp);

        //console.log("errCode is " + errCode);
        //console.log(errCode == "SUCCESS");
        test.equal(errCode, "SUCCESS", "ERRCODE WAS NOT SUCCESS");
    });
    
    var stubJson2 = {user : "user1"};
    historyController.getHistory(stubJson2, function(resultingJson){
        console.log(resultingJson);
        test.done();
    });
};

