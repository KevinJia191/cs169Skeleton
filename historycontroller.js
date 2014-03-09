/*
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require('./usercontroller.js');
var ingredient_controller = require('./ingredientcontroller.js');
var search_controller = require('./searchcontroller.js');
*/

var testing123 = 4;

//take in a "recipe" object eventually
var make = function(user, recipeData){
    console.log("hey hey" + testing123);
    return {errCode : 1,
            t : testing123
            };
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