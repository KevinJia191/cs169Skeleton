var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require('/usercontroller.js');
var ingredient_controller = require('/ingredientcontroller.js');
var history_controller = require('/historycontroller.js');
var search_controller = require('/searchcontroller.js');

//take in a "recipe" object eventually
var make = function(user, recipeData){
    return {errCode : 1};
}

var getHistory = function(user){
    return {errCode : 1};
}

var clearHistory = function(user){
    return {errCode : 1};
}
exports.make = make;
exports.getHistory = getHistory;
exports.clearHistory = clearHistory;