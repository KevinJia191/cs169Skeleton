var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');

var user_controller = require('./usercontroller.js');
var ingredient_controller = require('./ingredientcontroller.js');
var history_controller = require('./historycontroller.js');
var search_controller = require('./searchcontroller.js');


var search = function(param1,callback){
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
        q: param1
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
        new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
        };
        var format_son = JSON.stringify(new_son);
        //res.write(format_son);
        /*
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
      */
      callback(format_son);
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
      
    });
}

var getRecipeData = function(param1, param2){
    return {errCode : 1};
}

exports.search = search;
exports.getRecipeData = getRecipeData;
