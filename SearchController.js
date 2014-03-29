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
            callback(format_son);
          }
      });
    }
    
    function getRecipeData(param1, param2){
        return {errCode : 1};
    }
}
module.exports = searchcontroller;
