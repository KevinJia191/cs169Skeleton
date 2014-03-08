var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require("./user_controller.js");
var ingredient_controller = require('./ingredient_controller.js');
var history_controller = require('./history_controller.js');
var search_controller = require('./search_controller.js');

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
