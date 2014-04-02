var yummly = require('yummly');
var customYum = require('./YummlyAPIProcessor.js');
var yummlyProcessor = new customYum();
var Constants = require('./Constants.js');
var searchcontroller = function(json){
    this.credentials = {
      id: '13944c3c',
      key: '5a09042c7587234cbd1adc10150874cf'
    }
        
    this.json = json;

    this.search = function(recipie,callback){

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
        console.log("PRE SEARCH");
        try {
          console.log("ENTERED TRY");
          yummly.search({
            credentials: {id: '13944c3c', key: '5a09042c7587234cbd1adc10150874cf'},
            query: {
              q: recipie
            }
          }, function (error, response, json) {
            console.log(response.statusCode);
            //console.log(json.matches[0].id);
            if (error) {
              console.log(response.statusCode);
              console.error(error);
              var err_son = {
                  errCode:2
                }
                callback(JSON.stringify(err_son));
                return;
            } else {
              console.log(json.matches.length);
              if (json.matches.length==0){
                var err_son = {
                  errCode:2
                }
                callback(JSON.stringify(err_son));
                return;
              }
              var new_son = "";
              yummlyProcessor.search(json.matches,callback);
              /*
              yummlyProcessor.walk()
              for (var i=0;i<json.matches.length;i++) {
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
              */
              //callback(format_son);
            }
        });

        }
        catch(e){
          console.log("Yummly API is Down");
          var err_son = {
                  errCode:"YummlyAPI Unavailable"
                }
          callback(JSON.stringify(err_son));
        }
          
    }
    /*
    #important

    for this to work, it needs to be given recipe_id's
    @param json body in the form req.body
    @param callback

    */
    this.getRecipeData = function(recipe_body, callback){
        var recipe_id = recipe_body.recipe_id;
        /*
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
        */
        console.log("starting data");
        yummly.recipe({
          credentials: this.credentials,
          id: recipe_id // id of the first recipe returned by search
        }, function (error, response, json) {
          if (error) {
            console.error("*Error*:"+error);
	      callback({"errCode" : Constants.ERROR});
          } else {
            console.log("starting conversion");
            var new_son = JSON.stringify(json);            
            console.log(new_son);
            callback(new_son);
          }
        });
    }
}

module.exports = searchcontroller;
