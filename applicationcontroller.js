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
  res.write('<form action="login" method="post">Username <input type="text" name="username"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup">');
  res.end('</form></body></html>');
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
            recArray.push(json.matches[i].id);
            recnameArray.push(json.matches[i].recipeName);
            siuArray.push(json.matches[i].smallImageUrls);
            dArray.push(json.matches[i].sourceDisplayName);
            ilArray.push(json.matches[i].ingredients);
        }
      }
      new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
    };

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
      res.end(json.matches[0].recipeName);
      */
      res.end(new_son);
    });
    //res.write('<html><body>');
    //res.write('CHOCO TACO');
    
});


app.post('/users/login', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = user_controller.login(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});
  
app.post('/users/signup', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = user_controller.signup(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);});

app.post('/ingredients/add', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = ingredient_controller.add(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/ingredients/remove', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = ingredient_controller.remove(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/ingredients/removeAll', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = ingredient_controller.removeAll(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/search', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = search_controller.search(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.get('/getRecipeData', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = search_controller.signup(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.get('/history', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = history_controller.get(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});

app.post('/make', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example
    //process req, res to get stuff
    var jsonObject = history_controller.make(params);
    var jsonForm = JSON.stringify(jsonObject);
    res.end(jsonForm);
});



var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
