var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require('/user_controller.java');
var ingredient_controller = require('/ingredient_controller.java');
var history_controller = require('/history_controller.java');
var search_controller = require('/search_controller.java');

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