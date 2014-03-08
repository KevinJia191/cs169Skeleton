var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var yummly = require('yummly');
var async = require('async');

var user_controller = require('./usercontroller.js');
var ingredient_controller = require('./ingredientcontroller.js');
var history_controller = require('./historycontroller.js');
var search_controller = require('./searchcontroller.js');


var search = function(param1){
  /*
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
  async.series([
    function initialize(callback) {
      while(typeof credentials != "undefined"){
        callback();
        break;
      }
    },
    function startYummly(callback) {
      yummly.search({
      credentials: credentials,
      query: {
        q: 'chicken'
      }
    }, function (error, response, json) {
      if (error) {
        console.error(error);
        callback();
        return;
      } else if (response.statusCode === 200) {
        console.log("FRUITCAKES");
        console.log(json.matches[0].id);
        var new_son = "";
        for (var i=0;i<10;i++) {
            recArray.push(json.matches[i].id);
            recnameArray.push(json.matches[i].recipeName);
            siuArray.push(json.matches[i].smallImageUrls);
            dArray.push(json.matches[i].sourceDisplayName);
            ilArray.push(json.matches[i].ingredients);
            if (i==10){
              console.log("FINISED THE YUMMLY CALL");
              callback();
            }
        }
    },
    function finish() {
      console.log(3)
      new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
      };
      while (new_son!=)
    },
    function finish() {
      console.log(3)
      new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
      };
      if new
    },



	console.log("called");
        console.log("create final json")
        
      return format_son;
      }
    });
*/
}

var getRecipeData = function(param1, param2){
    return {errCode : 1};
}

exports.search = search;
exports.getRecipeData = getRecipeData;
