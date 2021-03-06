var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');
var gcm = require('node-gcm');
var UserController = require("./Controllers/UserController.js");
var RegistrationController = require("./Controllers/RegistrationController.js");
var IngredientController = require('./Controllers/IngredientController.js');
var HistoryController = require('./Controllers/HistoryController.js');
var SearchController = require('./Controllers/SearchController.js');
var MockFoodAPI = require('./Controllers/MockFoodAPI.js');
var Constants = require('./Constants.js');
var PostgreSQLDatabaseModel = require('./Models/PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./Parsers/PostgreSQLParser.js');

var IngredientModel = require('./Models/Ingredient.js');
var IngredientRecord = require('./Records/IngredientRecord.js');

var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.session({secret: '1AGFSSD7890QWERTY', key: 'sid', store: sessionStore, expires: new Date(Date.now() + (7 * 86400 * 1000))}));

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.bodyParser({limit: '5mb'}));
    app.use(express.json({limit: '5mb'}));
    app.use(express.urlencoded({limit: '5mb'}));
    app.use(app.router);
});

console.log("Beginning");

function checkForExpirations(constrain) {
    console.log("Checking...");
    var ingredientModel = new IngredientModel();
    var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
    ingredientModel.setDatabaseModel(db);
    var parser = new PostgreSQLParser();
    ingredientModel.setParser(parser);
    db.connect();
    ingredientModel.getExpiringIngredients(2, constrain, function(result) {
	db.end();
	for (user in result) {
	    var msg = "";
	    ingredients = result[user];
	    console.log("length:"+ingredients.length);
	    for (var index = 0; index < ingredients.length; index++) {
		//console.log(ingredients[index]);
		var env = function() { 
		    var ingredient = ingredients[index];
		    var record = new IngredientRecord();
		    var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
		    db.connect();
		    record.setUp(db, parser);
		    record.put("username", ingredient["username"]);
		    record.put("ingredient_name", ingredient["ingredient_name"]);
		    var current_date = new Date();
		    var date = (1+current_date.getUTCMonth())+"/"+current_date.getUTCDate()+"/"+current_date.getUTCFullYear();
		    record.put("expiration_date", ingredient["month"]+"/"+ingredient["day"]+"/"+ingredient["year"]);
		    record.update(function(err) {
			db.end();
		    }, {"notification_sent":date});
		}
		env();
		if (ingredients.length == 1) {
		    msg = msg + ingredients[index]["ingredient_name"];
		}
		else if (index == ingredients.length - 1) {
		    msg = msg + "and "+ ingredients[index]["ingredient_name"];
		}
		else if (ingredients.length == 2){
		    msg = msg + ingredients[index]["ingredient_name"]+" ";
		}
		else {
		    msg = msg + ingredients[index]["ingredient_name"]+", ";
		}
	    }
	    var regId = result[user][0]["reg_id"];
	    msg = msg + " will expire soon!";
	    console.log(msg);
	    var sender = "AIzaSyCJnQfzs7SN07m8x4v8CQdywZwLrAvYAE8";
	    notify(regId, msg, null, sender, function(results) {
	    });
	}
	console.log("Finished");
    });
}

setInterval(checkForExpirations, 1000*60*60, true);

function notify(regId, message, collapseKey, senderId, callback) {
    var message = new gcm.Message({
	//collapseKey: collapseKey,
	data: {
	    message: message
	}
    });
    // for testing
    //message.dryRun = true;
    var sender = new gcm.Sender(senderId);
    var registrationIds = [];
    registrationIds.push(regId);
    console.log("Sending message:"+message);
    sender.send(message, registrationIds, 4, function (err, result) {
	console.log("Message sent:"+message);
	var results = {};
	results["err"] = err;
	results["result"] = result;
	callback(results);
    });   
}



app.post('/forcePush', function(req, res) {
    checkForExpirations(false);
    var jsonObject = {};
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(jsonObject));
});

app.post('/push', function(req, res) {
    checkForExpirations(true);
    var jsonObject = {};
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(jsonObject));
});


app.post('/setRegistrationId', function(req, res) {
    var regController = new RegistrationController(res);
    regController.set(req);
});

app.get('/', function(req, res) {
  res.writeHead(200);
    res.write('<html><body>');
    res.write('<form action="users/login" method="post">Username :) <input type="text" name="user"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup"></form>');
    res.write('<form action="recipes/history" method="post"><input type="text" name="username">History Get Button <input type="submit" value="getHistory"></form>');
    res.write('<form action="yummly" method="post">Recipie Name <input type="text" name="q"><input type="submit" value="TestSearch" onclick=this.form.action="recipes/search"></form>');
    res.write('<form action="recipes/deleteAllHistory" method="post"><input type="text" name="username">Clear History<input type="submit" value="delete all history post Button"></form>');
    res.write('<form action="recipes/make" method="post">Username:<input type="text" name="user">RecipeName:<input type="text" name="recipe_name">Datecreated<input type="text" name="current_date">Rating:<input type="text" name="rating">Make <input type="submit" value="Make"></form>');
    res.write('<form action="recipes/getRecipeData" method="post">Recipe ID:<input type="text" name="recipe_id"><input type="submit" value="GetRecipeData"></form>');
    res.write('<form action="TESTAPI/resetFixture" method="post"><input type="text" name="username">RESET API <input type="submit" value="RESETTABLES"></form>');
    res.write('<form action="users/changePassword" method="post">Username <input type="text" name="user"><br>Password <input type="text" name="password"><br>newPassword<input type="text" name="newPassword"><input type="submit" value="Change" onclick=this.form.action="users/changePassword"></form>');
    res.end('</body></html>');
});

app.post('/users/signup', function(req, res) {
    var userController = new UserController(res);
    userController.signup(req);
});

app.post('/users/login', function(req, res) {
    var userController = new UserController(res);
    userController.login(req);
});

app.post('/users/verify', function(req, res) {
    var userController = new UserController(res);
    userController.verify(req);
});

app.post('/users/logout', function(req, res) {
    var userController = new UserController(res);
    userController.logout(req);
    var regController = new RegistrationController(res);
    regController.clear(req);
});




app.post('/users/changePassword', function(req, res) {
    var userController = new UserController(res);
    userController.changePassword(req);
});


app.post('/ingredients/add', function(req, res) {
    var ingredientController = new IngredientController(res);
    ingredientController.addIngredient(req.body);
});

app.post('/ingredients/remove', function(req, res) {
    var ingredientController = new IngredientController(res);
    var jsonObject = ingredientController.removeIngredient(req.body);
});

app.post('/ingredients/removeAll', function(req, res) {
    var ingredientController = new IngredientController(res);
    var jsonObject = ingredientController.removeAll(req.body);
});

app.post('/ingredients/get', function(req, res) {
    var ingredientController = new IngredientController(res);
    var jsonObject = ingredientController.getInventory(req.body);
});

app.post('/ingredients/clearAll', function(req, res) {
    var ingredientController = new IngredientController(res);
    var jsonObject = ingredientController.clearAll(req.body);
});

app.post('/ingredients/update', function(req, res) {
    var ingredientController = new IngredientController(res);
    var jsonObject = ingredientController.updateIngredient(req.body);
});

app.post('/recipes/search', function(req, res) {
    res.header('Content-Type', 'application/json');
    
    try {
        var searchController = new SearchController(null);
        searchController.search(req.body, function(result){
            res.end(result);
        });
    } 
    catch(err) {
        console.log(err);
        res.end({errCode:Constants.ERROR});
    }
});

app.post('/recipes/getRecipeData', function(req, res) {
    res.header('Content-Type', 'application/json');

    var searchController = new SearchController(null);

    console.log("starting get recipie data in HTTP Handler");

    try {
        searchController.getRecipeData(req.body,function(result){
          res.end(result);
        });
    }
    catch(err) {
        console.log("My error:"+err);
        res.end({errCode:Constants.ERROR});
    }
});

app.post('/recipes/history', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.getHistory(req.body);
});

app.post('/recipes/getHistoryWithRatings', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.getHistoryWithRatings(req.body);
});


app.post('/recipes/make', function(req, res) {    
    var historyController = new HistoryController(res); 
    historyController.make(req.body);
});

app.post('/recipes/deleteAllHistory', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.clearHistory(req.body);
});

app.post('/recipes/rate', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.rate(req.body);
});

app.post('/recipes/getRating', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.getRating(req.body);
});

app.post('/TESTAPI/resetFixture', function(req, res) {
    console.log("/TESTAPI/resetFixture");
    res.header('Content-Type', 'application/json');
  ///////
  //var params = { host: 'ec2-54-197-238-8.compute-1.amazonaws.com',user: 'zbbaxdqhmzxnwh',password: '8WEQZA6SCS4P911KYoKY0lNvpO',database: 'de0l8cfdtcishp',ssl: true };
    ////pg.connect(process.env.DATABASE_URL, function(err, client, done) {

    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    client.query('DELETE from ingredients', function(err, result) {
	client.query('DELETE from history', function(err, result) {
	    client.query('DELETE from ratings', function(err, result) {
		client.query('DELETE from users', function(err, result) {
		    var new_son = {
			errCode: 1
		    }
		    var format_son = JSON.stringify(new_son);
		    res.write(format_son);
		    res.end();
		    client.end();
		});
	    });
	});
    });


});

app.post('/picture/get', function(req, res) {
    console.log("incoming bytes:"+req.body.image.length);
    console.log("image id"+req.body.id);
    imageBytes = req.body.image;
    imageid = req.body.id;
    var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
    db.connect();
    var query = "insert into test values('"+imageid+"',"+imageBytes+")";
    db.query(query, function(err) {
	console.log("insertErr:"+err);
	var selectQuery = "select * from test where id ='"+imageid+"'";
	db.query(selectQuery, function(err, result){
	    db.end();
	    console.log("Select err:"+err);
	    console.log("Picture length:"+result.rows[0].picture.length);
	    var bytes = result.rows[0].picture.toJSON();
	    console.log("Bytes length:"+bytes.length);
	    var body = JSON.stringify({"image": bytes});
	    console.log( Buffer.byteLength(body, 'utf8'));
	    res.header({'content-length': Buffer.byteLength(body, 'utf8'), 'content-type': 'application/json'});
	    //res.header('Content-Type', 'application/json');
	    //res.header('Content-Length': Buffer.byteLength(body, 'utf8'));
	    res.write(body);
	    res.end();
	});
    }); 
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
