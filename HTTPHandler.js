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
    res.write('<form action="users/login" method="post">Username <input type="text" name="user"><br>Password <input type="text" name="password"><input type="submit" value="Login" onclick=this.form.action="users/login"><input type="submit" value="add" onclick=this.form.action="users/signup"></form>');
    res.write('<form action="recipes/history" method="get"><input type="text" name="username">History Get Button <input type="submit" value="getHistory"></form>');
    res.write('<form action="yummly" method="post">Recipie Name <input type="text" name="q"><input type="submit" value="TestSearch" onclick=this.form.action="recipes/search"></form>');
    res.write('<form action="recipes/deleteAllHistory" method="post"><input type="text" name="username">Clear History<input type="submit" value="delete all history post Button"></form>');
    res.write('<form action="recipes/make" method="post">Username:<input type="text" name="user">RecipeName:<input type="text" name="recipe_name">Datecreated<input type="text" name="current_date">Rating:<input type="text" name="rating">Make <input type="submit" value="Make"></form>');
    res.write('<form action="recipes/getRecipeData" method="post">Recipe ID:<input type="text" name="recipe_id"><input type="submit" value="GetRecipeData"></form>');
    res.write('<form action="TESTAPI/resetFixture" method="post"><input type="text" name="username">RESET API <input type="submit" value="RESETTABLES"></form>');
    
    res.end('</body></html>');
});

app.get('/test2', function(req,res) {
        console.log("SOMETHING IS HAPPENING");
        res.writeHead(200);
        var credentials = {
      id: '13944c3c',
      key: '5a09042c7587234cbd1adc10150874cf'
    }
        yummly.search({ // calling search first to get a recipe id
      credentials: credentials,
      query: {
        q: 'pasta'
      }
    }, function (error, response, json) {
      if (error) {
        console.error(error);
      } 
        yummly.recipe({
          credentials: credentials,
          id: json.matches[0].id // id of the first recipe returned by search
        }, function (error, response, json) {
          if (error) {
            console.error(error);
          } else {
            //console.log(json);
            var format_son = JSON.stringify(json);
            res.end(format_son);
          }
        });
    });
});


app.get('/search', function(req, res) {
  res.writeHead(200);
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
    var userController = new UserController(res);
    userController.signup(req.body);
});


  
app.post('/users/login', function(req, res) {
    var userController = new UserController(res);
    userController.login(req.body);
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

app.post('/recipes/getRecipeData', function(req, res) {
    res.header('Content-Type', 'application/json');
    //example

    //process req, res to get stuff
    var searchController = new SearchController(null);
    //var jsonObject = searchController.getRecipeData(null);
    //var jsonForm = JSON.stringify(jsonObject);

    //var id = req.body.recipe_id;
    //console.log(id);
    //console.log("with res"+res.body.recipe_id)
    console.log("starting get recipie data in HTTP Handler");
    /*
    yummly.search({ // calling search first to get a recipe id
              credentials: credentials,
              query: {
                q: 'pasta'
              }
            }, function (error, response, json) {
              if (error) {
                console.error(error);
              } else if (response.statusCode === 200) {
                yummly.recipe({
                  credentials: credentials,
                  id: json.matches[0].id // id of the first recipe returned by search
                }, function (error, response, json) {
                  if (error) {
                    console.error(error);
                  } else {
                    console.log(json);
                    res.end(json);
                  }
                });
              }
            });
    */
    searchController.getRecipeData(req.body,function(result){
      res.end(result);
    });
});

app.get('/recipes/history', function(req, res) {
    var historyController = new HistoryController(res);
    historyController.getHistory(req.body);
});

app.post('/recipes/make', function(req, res) {    
    var historyController = new HistoryController(res); 
    console.log("req.body is " + req.body);
    historyController.make(req.body);

});

app.post('/recipes/deleteAllHistory', function(req, res) {
    var historyController = new HistoryController(res);
    var stubJson = {user:"testUser"};
    historyController.clearHistory(req.body);
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

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
