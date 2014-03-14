var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');

var UserController = require("./UserController.js");
var IngredientController = require('./IngredientController.js');
var HistoryController = require('./HistoryController.js');
var SearchController = require('./SearchController.js');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});


app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.writeHead(200);
  res.write('<html><body>');
  res.write('<form action="users/login" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup"></form>');
  res.write('<form action="recipes/history" method="get"><input type="text" name="username">History Get Button <input type="submit" value="getHistory"></form>');
  res.write('<form action="yummly" method="post">Recipie Name <input type="text" name="q"><input type="submit" value="TestSearch" onclick=this.form.action="recipes/search"></form>');
  res.write('<form action="recipes/deleteAllHistory" method="post"><input type="text" name="username">Clear History<input type="submit" value="delete all history post Button"></form>');
  res.write('<form action="recipes/make" method="post"><input type="text" name="username">Make <input type="submit" value="delete all history post Button"></form>');
  res.write('<form action="TESTAPI/resetFixture" method="post"><input type="text" name="username">RESET API <input type="submit" value="RESETTABLES"></form>');

  res.end('</body></html>');
});

app.get('/test2', function(req,res) {
    res.writeHead(200);
    /*
    UNDERSTANDING OF HOW CALLBACKS WORK
    IT NEEDS THE CALLBACK TO BE CALLED AT THE END SO IT KNOWS TO START THE NEXT ONE, THATS HOW SERIES
    */
    
    console.log(52);
    console.log(53);
    console.log(54);
    var searchController = new SearchController(null);
    searchController.search(function(result){
      res.end(result);
    });

    /*
    SearchController.search(function(result){
      res.end(result);
    });
    */
});


app.get('/search', function(req, res) {
  res.writeHead(200);
  console.log("YUMMLY WORKS");
  
  /*
    TODO: MOVE THIS TO THE SEARCHCONTROLLER

  SAMPLE API CALL
  http://api.yummly.com/v1/api/recipes?_app_id=13944c3c&_app_key=5a09042c7587234cbd1adc10150874cf&q[]=chicken



  res.write('<html><body>');
  res.write('<form action="login" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup">');
  res.end('</form></body></html>');
  */
  //req.get("/JON");
  //res.get("/CAMILLE");
    jsonArray = []
    recArray=[];
    recnameArray=[];
    siuArray=[];
    dArray=[];
    ilArray=[];
    var credentials = {
      id: '13944c3c',
      key: '5a09042c7587234cbd1adc10150874cf'
    }
    yummly.search({
      credentials: credentials,
      query: {
        q: 'chicken'
      }
    }, function (error, response, json) {
      if (error) {
        console.error(error);
      } else if (response.statusCode === 200) {
        console.log("FRUITCAKES");
        console.log(json.matches[0].id);
        var new_son = {
          errCode: UserModel.ERR_BAD_CREDENTIALS,
          count: result.rows[0].count
        };
        for (var i=0;i<10;i++) {
            console.log("for loop");
            recArray.push(json.matches[i].id);
            recnameArray.push(json.matches[i].recipeName);
            siuArray.push(json.matches[i].smallImageUrls);
            dArray.push(json.matches[i].sourceDisplayName);
            ilArray.push(json.matches[i].ingredients);
        }
        new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
        };
        var format_son = JSON.stringify(new_son);
        res.write(format_son);
      }


      /*
      res.write(json.matches[0].recipeName);
      res.write(json.matches[1].recipeName);
      res.write(json.matches[2].recipeName);
      res.write(json.matches[3].recipeName);
      res.write(json.matches[4].recipeName);
      res.write(json.matches[5].recipeName);
      res.write(json.matches[6].recipeName);
      res.write(json.matches[7].recipeName);
      res.write(json.matches[8].recipeName);
      res.write(json.matches[9].recipeName);
      //res.end(json.matches[0].recipeName);
      */
      for (var i=0;i<10;i++) {
            console.log("for loop");
            recArray.push(json.matches[i].id);
            recnameArray.push(json.matches[i].recipeName);
            siuArray.push(json.matches[i].smallImageUrls);
            dArray.push(json.matches[i].sourceDisplayName);
            ilArray.push(json.matches[i].ingredients);
    }
      
      new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
        };
      var format_son = JSON.stringify(new_son);
      res.end(format_son);
    });
    //res.write('<html><body>');
    //res.write('CHOCO TACO');
    
});




app.post('/users/signup', function(req, res) {

  console.log(req.body);
   
  //START JSON HEADER
  res.header('Content-Type', 'application/json');

  
  var signinJSON = req.body;
  var userController = new UserController(null);
  
  //START REQUEST
  userController.signup(signinJSON, function(resultingJson){
    //RETURN RESULT
    res.end(resultingJson);

    });
  
  console.log(res.body);
});


  
app.post('/users/login', function(req, res) {
  
  console.log(req.body);

  //START JSON HEADER
  res.header('Content-Type', 'application/json');

  
  var loginJSON = req.body;
  var userController = new UserController(null);
  
  //START REQUEST
  userController.login(loginJSON, function(resultingJson) {
    //RETURN RESULT
    res.end(resultingJson);
  });
  
 
  console.log(res.body);
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

app.post('/recipes/search', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var q = req.body.q;
    var searchController = new SearchController(null);
    searchController.search(q,function(result){
      res.end(result);
    });
});

app.get('/recipes/getRecipeData', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example

    //process req, res to get stuff
    var searchController = new SearchController(null);
    var jsonObject = searchController.getRecipeData(null);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.get('/recipes/history', function(req, res) {
    res.header('Content-Type', 'application/json');

    var historyController = new HistoryController(res);
    var stubJson = {user : "testUser"};
    
    historyController.getHistory(stubJson);
});

app.post('/recipes/make', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    
    var historyController = new HistoryController(res);
    var stubJson = {user : "testUser",
                    recipe_name : "Onion Soup",
                    current_date : "2/2/2",
                    rating : 3
                   };
    
    historyController.make(stubJson);

});

app.post('/recipes/deleteAllHistory', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    
    var historyController = new HistoryController(res);
    var stubJson = {user : "testUser"};
    
    historyController.clearHistory(stubJson);
});

app.post('/TESTAPI/resetFixture', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('DELETE from users', function(err, result) {
        done();
        if(err) return console.error(err);
      });
      client.query('DELETE from history', function(err, result) {
        done();
        if(err) return console.error(err);
      });
      client.query('DELETE from ingredients', function(err, result) {
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

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
