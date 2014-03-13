var yummly = require('yummly');
var apiERROR = 1;
var noItems = 2;
var searchcontroller = function(json){
    
    this.json = json;
    /*
    var apple = {
    type: "macintosh",
    color: "red",
    getInfo: function (callback) {
		                console.log(1);
		                console.log(2);
		                console.log(3);
		                jsonArray = []
		                recArray=[];
		                recnameArray=[];
		                siuArray=[];
		                dArray=[];
		                ilArray=[];
		                console.log("happen 1");
		                var credentials = {
		                  id: '13944c3c',
		                  key: '5a09042c7587234cbd1adc10150874cf'
		                }
		                console.log("PRE SEARCH");
		                yummly.search({
		                  credentials: {id: '13944c3c', key: '5a09042c7587234cbd1adc10150874cf'},
		                  query: {
		                    q: "chicken"
		                  }
		                }, function (error, response, json) {
		                  console.log(response.statusCode);
		                  //console.log(json.matches[0].id);
		                  if (error) {
		                    console.log(response.statusCode);
		                    console.error(error);
		                  } else {
		                    console.log("FRUITCAKES");
		                    console.log(json.matches[0].id);
		                    var new_son = "";
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
		                    callback(format_son);
		                  }
		        });
		    }
		}*/

    this.search = function(recipie,callback){
    	//console.log(1);
        //console.log(2);
        //console.log(3);
        jsonArray = []
        recArray=[];
        recnameArray=[];
        siuArray=[];
        dArray=[];
        ilArray=[];
        //console.log("happen 1");
        var credentials = {
          id: '13944c3c',
          key: '5a09042c7587234cbd1adc10150874cf'
        }
        //console.log("PRE SEARCH");
        yummly.search({
          credentials: {id: '13944c3c', key: '5a09042c7587234cbd1adc10150874cf'},
          query: {
            q: recipie
          }
        }, function (error, response, json) {
          //console.log(response.statusCode);
          //console.log(json.matches[0].id);
          if (error) {
            //console.log(response.statusCode);
            //console.error(error);
            err_son = {
            errCode:apiERROR
            };
            callback(JSON.stringify(err_son));
            return;
          } else {
            //console.log("FRUITCAKES");
            //console.log("matches length is "+json.matches.length);
            if(json.matches.length==0){
                //console.log("we 0 length case!");
                err_son = {
                errCode:noItems
                };
                callback(JSON.stringify(err_son));
                return;
            }
            var new_son = "";
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
