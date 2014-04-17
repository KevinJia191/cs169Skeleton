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
              q: recipie,
              maxResults: 25,
              start: 25
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
