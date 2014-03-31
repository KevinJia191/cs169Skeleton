var yummly = require('yummly');
var customYum = require('./YummlyAPIProcessor.js');
var yummlyProcessor = new customYum();
var searchcontroller = function(json){
    
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
    /*
    #important

    for this to work, it needs to be given recipe_id's
    @param json.matches[0].id
    @param callback

    */
    function getRecipeData(recipie_id, callback){
        yummly.recipe({
          credentials: credentials,
          id: recipie_id // id of the first recipe returned by search
        }, function (error, response, json) {
          if (error) {
            console.error(error);
          } else {
            console.log(json);
            callback(json);
          }
        });
        return {errCode : 1};
    }
}
module.exports = searchcontroller;
