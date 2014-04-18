var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');

var UserController = require("./UserController.js");
var IngredientController = require('./IngredientController.js');
var HistoryController = require('./HistoryController.js');
var SearchController = require('./SearchController.js');
var MockFoodAPI = require('./MockFoodAPI.js');
var Constants = require('./Constants.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');

var SessionModel = require('./SessionController.js');

var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.session({secret: 'secrete_key', key: 'sid', store: sessionStore}));

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
    app.use(express.bodyParser({limit: '5mb'}));
    app.use(express.json({limit: '5mb'}));
    app.use(express.urlencoded({limit: '5mb'}));
    app.use(app.router);
});


app.post('/awesome', function(req, res) {
    console.log(req);
    res.header('Content-Type', 'application/json');
    console.log("/awesome");
    req.session.derp = 'EVERYTHING IS AWESOME';
    myjson= {"hi": "there"};
    res.end(JSON.stringify(myjson));
});

app.post('/awesome2', function(req, res) {
    console.log(req);
    console.log("/awesome2");
    res.header('Content-Type', 'application/json');
    //console.log(req);
    myjson = {};
    if(req.session.user){
	myjson= {"hi": req.session.user};
    }
    else {
	myjson = {"no":"data"};
    }
    res.end(JSON.stringify(myjson));
});


app.post('/awesome3', function(req, res) {
    res.header('Content-Type', 'application/json');
    myjson= {"hi": "there"};
    res.end(JSON.stringify(myjson));
});



app.post('/cookietest', function(req, res) {
    console.log("Running /cookietest");
    res.header('Content-Type', 'application/json');
    console.log(req);
    console.log(req.cookies);
    res.cookie("flerp", "werp");
    myjson= {"hi": "there"};
    res.send(JSON.stringify(myjson));
    res.end();
    
	
});

app.get('/', function(req, res) {
  res.writeHead(200);
    res.write('<html><body>');
    res.write('<form action="users/login" method="post">Username :) <input type="text" name="user"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup"></form>');
    res.write('<form action="recipes/history" method="get"><input type="text" name="username">History Get Button <input type="submit" value="getHistory"></form>');
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
    userController.signup(req.body);
});

app.post('/users/login', function(req, res) {
    var userController = new UserController(res);
    userController.login(req.body);
});

app.post('/users/signup2', function(req, res) {
    req.session.regenerate(function() {
        req.session.user = req.body.user;
        req.session.save();
    });

    var userController = new UserController(res);
    userController.signup(req.body);
});

app.post('/users/login2', function(req, res) {
    req.session.regenerate(function() {
        req.session.user = req.body.user;
        req.session.save();
    });

    var userController = new UserController(res);
    userController.login(req.body);
});




app.post('/sessionLogin', function(req,res) {
    //console.log(req);
    console.log("user session:"+req.session.user);
    if (req.session.user) {
	var sessionModel = new SessionModel(res);
	sessionModel.verify(req.session);
    }
    else {
	var json = {"errCode" : Constants.ERROR};
	res.end(JSON.stringify(json));
    }


/*
    res.header('Content-Type', 'application/json');
    var json = {errCode : ''}

    try {

      var sid = req.cookies.sid.split(':')[1].split('.')[0];
      sessionStore.get(sid, function(err, sess){
        if (err || sess == undefined){
          json.errCode = Constants.ERR_USER_NOTFOUND;
          res.end(JSON.stringify(json));
        } else {
          // check database
          var sessionController = new SessionController(res);
          sessionController.checkUser(sess.user);
        };
      });

    }catch (err) {
      json.errCode = Constants.ERR_USER_NOTFOUND;
      res.end(JSON.stringify(json));

    }
    */
});
  


app.post('/users/changePassword', function(req, res) {
    var userController = new UserController(res);
    userController.changePassword(req.body);
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

app.post('/TESTAPI/resetFixture', function(req, res) {
    console.log("/TESTAPI/resetFixture");
    res.header('Content-Type', 'application/json');
  ///////
  //var params = { host: 'ec2-54-197-238-8.compute-1.amazonaws.com',user: 'zbbaxdqhmzxnwh',password: '8WEQZA6SCS4P911KYoKY0lNvpO',database: 'de0l8cfdtcishp',ssl: true };
    ////pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('DELETE from ingredients', function(err, result) {
        done();
        if(err) return console.error(err);
      });
      client.query('DELETE from history', function(err, result) {
        done();
        if(err) return console.error(err);
      });
      client.query('DELETE from users', function(err, result) {
        done();
        if(err) return console.error(err);
      });
    });
    var new_son = {
      errCode: 1
    }
    var format_son = JSON.stringify(new_son);
    res.write(format_son);
    res.end();

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
