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
  res.write('<form action="yummly" method="post">Recipie Name <input type="text" name="q"><input type="submit" value="Login" onclick=this.form.action="search">');
  res.end('</form></body></html>');
});


app.post('/search', function(req, res) {
  res.writeHead(200);
  var query = req.body.q;
  result = search_controller.search(query);
  console.log(result);
  res.end(result);
  
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
