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

    //Kevin Jia:
    //I changed this function's input to take in a whole json(req.body) instead of just recipe, cause we're adding more
    //things to parse through, instead of just recipe
    //postRequest is of the form:
    //  q: search keyword
    //  allowedCourseFilteres: [Breakfast: true...]
    this.search = function(postRequest,callback){
        //Array Initilizations
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
        try {
          //allowedCourse : ["course^course-Appetizers"]
          //See https://developer.yummly.com/documentation for details here... it's scary
            yummly.search({
            credentials: {id: '13944c3c', key: '5a09042c7587234cbd1adc10150874cf'},
                query: {
                  q: postRequest.q,
                  maxResults: 25,
                  start: 25,
                  allowedCourse : postRequest.allowedCourse,
                  allowedAllergy : postRequest.allowedAllergy
                }
            }, function (error, response, json) {
                if (error) {
                  var err_son = {
                      errCode:"YUMMLY ERROR"
                    }
                    callback(JSON.stringify(err_son));
                    return;
                } 
                else {
                    if (json.matches.length==0){
                        var err_son = {
                          errCode:"No recipe's found"
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
