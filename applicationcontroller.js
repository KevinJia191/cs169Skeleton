var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');

var user_controller = require("./usercontroller.js");
var ingredient_controller = require('./ingredientcontroller.js');
var history_controller = require('./historycontroller.js');
var search_controller = require('./searchcontroller.js');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});


app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.writeHead(200);
  res.write('<html><body>');
  res.write('<form action="login" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup"></form>');
  res.write('<form action="history" method="get"><input type="text" name="username">History Get Button <input type="submit" value="getHistory"></form>');
  res.end('</body></html>');
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


app.post('/users/login', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var userController = new user_controller;
    var jsonObject = userController.login(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});
  
app.post('/users/signup', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var userController = new user_controller;
    var jsonObject = userController.signup(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);});

app.post('/ingredients/add', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var ingredientController = new ingredient_controller;
    var jsonObject = ingredientController.add(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/ingredients/remove', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var ingredientController = new ingredient_controller;
    var jsonObject = ingredientController.remove(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/ingredients/removeAll', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var ingredientController = new ingredient_controller;
    var jsonObject = ingredientController.removeAll(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/search', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var searchController = new search_controller;
    var jsonObject = searchController.search(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.get('/getRecipeData', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example

    //process req, res to get stuff
    var searchController = new search_controller;
    var jsonObject = searchController.signup(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.get('/history', function(req, res) {
    res.header('Content-Type', 'application/json');

    var historyController = new history_controller;
    var jsonObject = historyController.getHistory();
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/make', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    
    var historyController = new history_controller;
    var jsonObject = historyController.make(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});



var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
